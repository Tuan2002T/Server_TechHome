const { Server } = require('socket.io');
const Redis = require('ioredis');

// Redis configuration based on environment
const REDIS_CONFIG = {
  host: process.env.USE_DOCKER === 'true' ? 'redis' : (process.env.REDIS_HOST || 'localhost'),
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    const maxRetryTime = 1000 * 60 * 60; // 1 hour in milliseconds
    const delay = Math.min(times * 50, 2000);
    
    // Stop retrying after 1 hour
    if (delay > maxRetryTime) {
      return null;
    }
    
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  showFriendlyErrorStack: true
};

class SocketManager {
  constructor() {
    this.io = null;
    this.usersOnline = new Map();
    this.chatRooms = new Map();
    this.heartbeatInterval = 30000; // 30 seconds
    this.connectionTimeout = 60000; // 60 seconds
    this.initializeRedis();
  }

  initializeRedis() {
    // Create Redis client with logging
    console.log('Initializing Redis with config:', {
      host: REDIS_CONFIG.host,
      port: REDIS_CONFIG.port
    });

    this.redis = new Redis(REDIS_CONFIG);

    // Redis error handling
    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
      if (error.code === 'ECONNREFUSED') {
        console.error('Unable to connect to Redis. Please check:');
        console.error('1. Redis service is running');
        console.error(`2. Redis host is correct (current: ${REDIS_CONFIG.host})`);
        console.error(`3. Redis port is correct (current: ${REDIS_CONFIG.port})`);
        console.error('4. Network configuration is correct');
      }
    });

    this.redis.on('connect', () => {
      console.log('Connected to Redis successfully');
    });

    this.redis.on('ready', () => {
      console.log('Redis client is ready to receive commands');
    });

    this.redis.on('reconnecting', () => {
      console.log('Redis client is reconnecting...');
    });
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
      },
      pingTimeout: this.connectionTimeout,
      pingInterval: this.heartbeatInterval,
      connectTimeout: 45000, // 45 second timeout for initial connection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketHandlers();
    return this.io;
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Setup error handling
      socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.handleDisconnect(socket);
      });

      // Setup connection monitoring
      const connectionTimer = setTimeout(() => {
        if (socket.connected) {
          socket.emit('ping');
        }
      }, this.heartbeatInterval);

      socket.on('pong', () => {
        clearTimeout(connectionTimer);
      });

      // User status handling
      socket.on('userOnline', (userId) => this.handleUserOnline(socket, userId));
      socket.on('userOffline', (userId) => this.handleUserOffline(socket, userId));

      // Chat room handling
      socket.on('joinChat', (chatId) => this.handleJoinChat(socket, chatId));
      socket.on('outChat', (chatId) => this.handleLeaveChat(socket, chatId));
      socket.on('sendMessage', (message, chatId) => this.handleSendMessage(socket, message, chatId));
      socket.on('deleteMessage', (chatId, messageId) => this.handleDeleteMessage(socket, chatId, messageId));

      // Disconnect handling
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  async handleUserOnline(socket, userId) {
    try {
      this.usersOnline.set(userId, socket.id);
      await this.redis.hset('online_users', userId, socket.id);
      this.broadcastUserStatus(userId, true);
    } catch (error) {
      console.error('Error in handleUserOnline:', error);
    }
  }

  async handleUserOffline(socket, userId) {
    try {
      this.usersOnline.delete(userId);
      await this.redis.hdel('online_users', userId);
      this.broadcastUserStatus(userId, false);
    } catch (error) {
      console.error('Error in handleUserOffline:', error);
    }
  }

  async handleJoinChat(socket, chatId) {
    try {
      const userId = this.getUserIdFromSocket(socket);
      if (!userId) return;

      let chatRoom = this.chatRooms.get(chatId) || new Set();
      chatRoom.add(socket.id);
      this.chatRooms.set(chatId, chatRoom);

      socket.join(chatId);
      await this.redis.sadd(`chat:${chatId}:members`, socket.id);
    } catch (error) {
      console.error('Error in handleJoinChat:', error);
    }
  }

  async handleLeaveChat(socket, chatId) {
    try {
      const chatRoom = this.chatRooms.get(chatId);
      if (chatRoom) {
        chatRoom.delete(socket.id);
        if (chatRoom.size === 0) {
          this.chatRooms.delete(chatId);
        }
      }
      socket.leave(chatId);
      await this.redis.srem(`chat:${chatId}:members`, socket.id);
    } catch (error) {
      console.error('Error in handleLeaveChat:', error);
    }
  }

  handleSendMessage(socket, message, chatId) {
    try {
      const chatRoom = this.chatRooms.get(chatId);
      if (!chatRoom) return;

      socket.to(chatId).emit('receiveMessage', {
        ...message,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  }

  handleDeleteMessage(socket, chatId, messageId) {
    try {
      const chatRoom = this.chatRooms.get(chatId);
      if (!chatRoom) return;

      socket.to(chatId).emit('deleteMessage', messageId);
    } catch (error) {
      console.error('Error in handleDeleteMessage:', error);
    }
  }

  async handleDisconnect(socket) {
    try {
      // Clean up user status
      for (const [userId, socketId] of this.usersOnline.entries()) {
        if (socketId === socket.id) {
          await this.handleUserOffline(socket, userId);
        }
      }

      // Clean up chat rooms
      for (const [chatId, room] of this.chatRooms.entries()) {
        if (room.has(socket.id)) {
          await this.handleLeaveChat(socket, chatId);
        }
      }

      console.log('User disconnected:', socket.id);
    } catch (error) {
      console.error('Error in handleDisconnect:', error);
    }
  }

  getUserIdFromSocket(socket) {
    for (const [userId, socketId] of this.usersOnline.entries()) {
      if (socketId === socket.id) return userId;
    }
    return null;
  }

  broadcastUserStatus(userId, isOnline) {
    this.io.emit('userStatusChange', { userId, isOnline });
  }
}

// Create and export a singleton instance
const socketManager = new SocketManager();

const createSocket = (server) => {
  return socketManager.initialize(server);
};

module.exports = createSocket;