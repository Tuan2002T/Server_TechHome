const { Sequelize, DataTypes } = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()
const isDocker = process.env.USE_DOCKER === 'true'

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAMEPG,
  process.env.PASSWORD,
  {
    host: isDocker ? process.env.HOST_DOCKER : process.env.HOST,
    port: process.env.PORT,
    dialect: 'postgres',
    logging: false
  }
)

const chatResidentModal = require('./ChatResidentModal')
const residentNotificationModal = require('./ResidentNotificationModal')
const residentApartmentModal = require('./ResidentApartment')
const adminModel = require('./AdminModel.js')
const apartmentDetailModel = require('./ApartmentDetailModel.js')
const apartmentModel = require('./ApartmentModel.js')
const buildingModel = require('./BuildingModel.js')
const complaintModel = require('./ComplainModel.js')
const eventModel = require('./EventModel.js')
const facilityModel = require('./FacilityModel.js')
const floorModel = require('./FloorModel.js')
const notificationModel = require('./NotificationModel.js')
const paymentModel = require('./PaymentModel.js')
const ResidentModel = require('./ResidentModel.js')
const rolesModel = require('./Roles.js')
const serviceModel = require('./ServiceModel.js')
const userModel = require('./UserModel.js')
const vehicleModel = require('./VehicleModel.js')
const billModel = require('./BillModel.js')
const serviceBookingModel = require('./ServiceBookingsModel.js')
const chatModel = require('./ChatModel.js')
const messageModel = require('./MessageModel.js')
const fileModel = require('./FileModel.js')
const sequelizePaginate = require('sequelize-paginate')

const Admin = sequelize.define('Admin', adminModel)
const ApartmentDetail = sequelize.define(
  'ApartmentDetail',
  apartmentDetailModel
)
const Apartment = sequelize.define('Apartment', apartmentModel)
const Building = sequelize.define('Building', buildingModel)
const Complaint = sequelize.define('Complaint', complaintModel)
const Event = sequelize.define('Event', eventModel)
const Facility = sequelize.define('Facility', facilityModel)
const Floor = sequelize.define('Floor', floorModel)
const Notification = sequelize.define('Notification', notificationModel)
const Payment = sequelize.define('Payment', paymentModel)
const Resident = sequelize.define('Resident', ResidentModel)
const Roles = sequelize.define('Roles', rolesModel)
const Service = sequelize.define('Service', serviceModel)
const User = sequelize.define('User', userModel)
const Vehicle = sequelize.define('Vehicle', vehicleModel)
const Bill = sequelize.define('Bill', billModel)
const ServiceBooking = sequelize.define('ServiceBooking', serviceBookingModel)
const Chat = sequelize.define('Chat', chatModel)
const Message = sequelize.define('Message', messageModel)
const File = sequelize.define('File', fileModel)
const ResidentApartment = sequelize.define(
  'ResidentApartment',
  residentApartmentModal
)
const ResidentNotification = sequelize.define(
  'ResidentNotification',
  residentNotificationModal
)
const ChatResident = sequelize.define('ChatResident', chatResidentModal)

Chat.belongsToMany(Resident, {
  through: 'ChatResident',
  foreignKey: 'chatId',
  onDelete: 'CASCADE' // Changed from SET NULL
})
Resident.belongsToMany(Chat, {
  through: 'ChatResident',
  foreignKey: 'residentId',
  onDelete: 'CASCADE' // Changed from SET NULL
})

Notification.belongsToMany(Resident, {
  through: 'ResidentNotification', // Correct reference to the join table model
  foreignKey: 'notificationId',
  onDelete: 'SET NULL'
})
Resident.belongsToMany(Notification, {
  through: 'ResidentNotification', // Correct reference to the join table model
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})

Apartment.belongsToMany(Resident, {
  through: 'ResidentApartment', // Correct reference to the join table model
  foreignKey: 'apartmentId',
  onDelete: 'SET NULL'
})
Resident.belongsToMany(Apartment, {
  through: 'ResidentApartment', // Correct reference to the join table model
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})

User.belongsTo(Roles, {
  foreignKey: 'roleId',
  onDelete: 'SET NULL'
})
Roles.hasMany(User, {
  foreignKey: 'roleId',
  onDelete: 'SET NULL'
})

User.hasOne(Admin, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})
Admin.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})

User.hasOne(Resident, {
  foreignKey: 'userId',
  onDelete: 'SET NULL'
})
Resident.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})

Resident.hasMany(Bill, { foreignKey: 'residentId', onDelete: 'SET NULL' })
Bill.belongsTo(Resident, { foreignKey: 'residentId', onDelete: 'CASCADE' })

Apartment.belongsToMany(Resident, {
  through: 'ResidentApartments',
  foreignKey: 'apartmentId',
  onDelete: 'SET NULL'
})
Resident.belongsToMany(Apartment, {
  through: 'ResidentApartments',
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})

Building.hasMany(Floor, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL'
})
Floor.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

Building.belongsToMany(Service, {
  through: 'BuildingServices',
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

Service.belongsToMany(Building, {
  through: 'BuildingServices',
  foreignKey: 'serviceId',
  onDelete: 'CASCADE'
})

Service.hasMany(ServiceBooking, {
  foreignKey: 'serviceId',
  onDelete: 'SET NULL'
})
ServiceBooking.belongsTo(Service, {
  foreignKey: 'serviceId',
  onDelete: 'CASCADE'
})

Resident.hasMany(ServiceBooking, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})
ServiceBooking.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

Building.hasMany(Admin, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL'
})
Admin.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

Notification.belongsTo(Admin, {
  foreignKey: 'adminId',
  onDelete: 'SET NULL'
})
Admin.hasMany(Notification, {
  foreignKey: 'adminId',
  onDelete: 'SET NULL'
})

Floor.hasMany(Apartment, {
  foreignKey: 'floorId',
  onDelete: 'SET NULL'
})
Apartment.belongsTo(Floor, {
  foreignKey: 'floorId',
  onDelete: 'CASCADE'
})

Apartment.hasOne(ApartmentDetail, {
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE'
})
ApartmentDetail.belongsTo(Apartment, {
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE'
})

Resident.hasMany(ApartmentDetail, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})
ApartmentDetail.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

Resident.hasMany(Vehicle, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
Vehicle.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})

Resident.hasMany(Complaint, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})
Complaint.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

const ResidentNotifications = sequelize.define('ResidentNotifications', {
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
})
Resident.belongsToMany(Notification, {
  through: 'ResidentNotifications',
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})
Notification.belongsToMany(Resident, {
  through: 'ResidentNotifications',
  foreignKey: 'notificationId',
  onDelete: 'CASCADE'
})

Building.belongsToMany(Facility, {
  through: 'BuildingFacilities',
  foreignKey: 'buildingId',
  onDelete: 'SET NULL'
})

Facility.belongsToMany(Building, {
  through: 'BuildingFacilities',
  foreignKey: 'facilityId',
  onDelete: 'CASCADE'
})

Building.hasMany(Event, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL'
})

Event.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

Bill.belongsToMany(Payment, {
  through: 'BillPayment',
  foreignKey: 'billId',
  otherKey: 'paymentId'
})

Payment.belongsToMany(Bill, {
  through: 'BillPayment',
  foreignKey: 'paymentId',
  otherKey: 'billId'
})

ServiceBooking.hasOne(Bill, {
  foreignKey: 'serviceBookingId',
  onDelete: 'SET NULL'
})

Bill.belongsTo(ServiceBooking, {
  foreignKey: 'serviceBookingId'
})

Chat.belongsToMany(Resident, {
  through: 'ChatResident',
  foreignKey: 'chatId',
  onDelete: 'SET NULL'
})
Resident.belongsToMany(Chat, {
  through: 'ChatResident',
  foreignKey: 'residentId',
  onDelete: 'SET NULL'
})

Message.belongsToMany(File, {
  through: 'MessageFiles',
  foreignKey: 'messageId',
  onDelete: 'SET NULL'
})

File.belongsToMany(Message, {
  through: 'MessageFiles',
  foreignKey: 'fileId',
  onDelete: 'SET NULL'
})
sequelizePaginate.paginate(Message)
sequelizePaginate.paginate(Chat)
sequelizePaginate.paginate(Notification)
sequelizePaginate.paginate(Complaint)
sequelizePaginate.paginate(Event)
sequelizePaginate.paginate(Service)
sequelizePaginate.paginate(ServiceBooking)
sequelizePaginate.paginate(Bill)
sequelizePaginate.paginate(Payment)
sequelizePaginate.paginate(Facility)
sequelizePaginate.paginate(Resident)
sequelizePaginate.paginate(Admin)
sequelizePaginate.paginate(User)
sequelizePaginate.paginate(Roles)
sequelizePaginate.paginate(Vehicle)
sequelizePaginate.paginate(Apartment)
sequelizePaginate.paginate(ApartmentDetail)
sequelizePaginate.paginate(Building)
module.exports = {
  sequelize,
  User,
  Admin,
  Resident,
  Apartment,
  ApartmentDetail,
  Building,
  Floor,
  Vehicle,
  Complaint,
  Notification,
  Payment,
  Service,
  Roles,
  Facility,
  Event,
  Bill,
  ServiceBooking,
  Chat,
  Message,
  File,
  ResidentApartment,
  ResidentNotification,
  ChatResident
}
