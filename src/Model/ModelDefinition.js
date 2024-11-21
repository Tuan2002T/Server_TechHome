const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAMEPG,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'postgres',
    logging: false
  }
)

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

// User and Role relationship
User.belongsTo(Roles, {
  foreignKey: 'roleId',
  onDelete: 'SET NULL' // Giữ lại User nếu Role bị xóa
})
Roles.hasMany(User, {
  foreignKey: 'roleId',
  onDelete: 'SET NULL' // Giữ lại Role nếu User bị xóa
})

// User and Admin relationship
User.hasOne(Admin, {
  foreignKey: 'userId',
  onDelete: 'CASCADE' // Xóa Admin nếu User bị xóa
})
Admin.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE' // Xóa User nếu Admin bị xóa
})

// User and Resident relationship
User.hasOne(Resident, {
  foreignKey: 'userId',
  onDelete: 'SET NULL' // Giữ lại User nếu Resident bị xóa
})
Resident.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE' // Xóa User nếu Resident bị xóa
})

// Resident and Apartment relationship
Apartment.belongsToMany(Resident, {
  through: 'ResidentApartments',
  foreignKey: 'apartmentId',
  onDelete: 'SET NULL' // Giữ lại Resident nếu Apartment bị xóa
})
Resident.belongsToMany(Apartment, {
  through: 'ResidentApartments',
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Apartment nếu Resident bị xóa
})

// Building and Floor relationship
Building.hasMany(Floor, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL' // Giữ lại Floor nếu Building bị xóa
})
Floor.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE' // Xóa Floor nếu Building bị xóa
})

// Building and Service relationship
Building.hasMany(Service, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL' // Giữ lại Service nếu Building bị xóa
})
Service.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE' // Xóa Service nếu Building bị xóa
})

// Building and Admin relationship
Building.hasMany(Admin, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL' // Giữ lại Admin nếu Building bị xóa
})
Admin.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE' // Xóa Admin nếu Building bị xóa
})

// Floor and Apartment relationship
Floor.hasMany(Apartment, {
  foreignKey: 'floorId',
  onDelete: 'SET NULL' // Giữ lại Apartment nếu Floor bị xóa
})
Apartment.belongsTo(Floor, {
  foreignKey: 'floorId',
  onDelete: 'CASCADE' // Xóa Floor nếu Apartment bị xóa
})

// Apartment and ApartmentDetail relationship
Apartment.hasOne(ApartmentDetail, {
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE' // Xóa ApartmentDetail nếu Apartment bị xóa
})
ApartmentDetail.belongsTo(Apartment, {
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE' // Xóa Apartment nếu ApartmentDetail bị xóa
})

// Resident and ApartmentDetail relationship
Resident.hasMany(ApartmentDetail, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại ApartmentDetail nếu Resident bị xóa
})
ApartmentDetail.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE' // Xóa Resident nếu ApartmentDetail bị xóa
})

// Resident and Vehicle relationship
Resident.hasMany(Vehicle, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Vehicle nếu Resident bị xóa
})
Vehicle.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE' // Xóa Vehicle nếu Resident bị xóa
})

// Resident and Complaint relationship
Resident.hasMany(Complaint, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Complaint nếu Resident bị xóa
})
Complaint.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE' // Xóa Resident nếu Complaint bị xóa
})

// Resident and Notification relationship
Resident.hasMany(Notification, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Notification nếu Resident bị xóa
})
Notification.belongsToMany(Resident, {
  through: 'NotificationResident',
  foreignKey: 'notificationId',
  otherKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Notification nếu Resident bị xóa
})

// Resident and Payment relationship
Resident.hasMany(Payment, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Payment nếu Resident bị xóa
})
Payment.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE' // Xóa Resident nếu Payment bị xóa
})

// Resident and Service relationship
Resident.hasMany(Service, {
  foreignKey: 'residentId',
  onDelete: 'SET NULL' // Giữ lại Service nếu Resident bị xóa
})
Service.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE' // Xóa Resident nếu Service bị xóa
})

// Payment and Service relationship
Payment.hasMany(Service, {
  foreignKey: 'paymentId',
  onDelete: 'SET NULL' // Giữ lại Service nếu Payment bị xóa
})
Service.belongsTo(Payment, {
  foreignKey: 'paymentId',
  onDelete: 'CASCADE' // Xóa Payment nếu Service bị xóa
})

// Building and Facility relationship
Building.hasMany(Facility, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL' // Giữ lại Facility nếu Building bị xóa
})
Facility.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE' // Xóa Building nếu Facility bị xóa
})

// Building and Event relationship
Building.hasMany(Event, {
  foreignKey: 'buildingId',
  onDelete: 'SET NULL' // Giữ lại Event nếu Building bị xóa
})
Event.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE' // Xóa Building nếu Event bị xóa
})

Bill.hasMany(Payment, {
  foreignKey: 'billId',
  onDelete: 'SET NULL'
})
Payment.belongsTo(Bill, {
  foreignKey: 'billId',
  onDelete: 'CASCADE'
})

ServiceBooking.hasMany(Payment, {
  foreignKey: 'serviceBookingId',
  onDelete: 'SET NULL'
})
Payment.belongsTo(ServiceBooking, {
  foreignKey: 'serviceBookingId',
  onDelete: 'CASCADE'
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
sequelizePaginate.paginate(Floor)
module.exports = {
  // initializeDefaultAdmin,
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
  Event
}
