const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('techhome', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log
})

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

//User and Role relationship
User.belongsTo(Roles, {
  foreignKey: 'roleId',
  onDelete: 'CASCADE'
})
Roles.hasMany(User, {
  foreignKey: 'roleId',
  onDelete: 'CASCADE'
})

//User and Admin relationship
User.hasOne(Admin, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})
Admin.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})
//User and Resident relationship
User.hasOne(Resident, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})
Resident.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})
//Resident and Apartment relationship
Apartment.belongsToMany(Resident, {
  through: 'ResidentApartments',
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE'
})
Resident.belongsToMany(Apartment, {
  through: 'ResidentApartments',
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

//Building and Floor relationship
Building.hasMany(Floor, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})
Floor.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

//Building and Service relationship
Building.hasMany(Service, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})
Service.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

//Buiding and Admin relationship
Building.hasMany(Admin, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})
Admin.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

//Floor and Apartment relationship
Floor.hasMany(Apartment, {
  foreignKey: 'floorId',
  onDelete: 'CASCADE'
})
Apartment.belongsTo(Floor, {
  foreignKey: 'floorId',
  onDelete: 'CASCADE'
})

//Apartment and ApartmentDetail relationship
Apartment.hasOne(ApartmentDetail, {
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE'
})
ApartmentDetail.belongsTo(Apartment, {
  foreignKey: 'apartmentId',
  onDelete: 'CASCADE'
})

//Resident and ApartmentDetail relationship
Resident.hasMany(ApartmentDetail, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
ApartmentDetail.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

//Resident and Vehicle relationship
Resident.hasMany(Vehicle, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
Vehicle.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

//Resident and Complaint relationship
Resident.hasMany(Complaint, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
Complaint.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

//Resident and Notification relationship
Resident.hasMany(Notification, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
Notification.belongsToMany(Resident, {
  through: 'NotificationResident',
  foreignKey: 'notificationId',
  otherKey: 'residentId'
})

//Resident and Payment relationship
Resident.hasMany(Payment, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
Payment.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

//Resident and Service relationship

Resident.hasMany(Service, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})
Service.belongsTo(Resident, {
  foreignKey: 'residentId',
  onDelete: 'CASCADE'
})

//Payment and Service relationship
Payment.hasMany(Service, {
  foreignKey: 'paymentId',
  onDelete: 'CASCADE'
})
Service.belongsTo(Payment, {
  foreignKey: 'paymentId',
  onDelete: 'CASCADE'
})

//building and Facility relationship
Building.hasMany(Facility, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})
Facility.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

//Building and Event relationship
Building.hasMany(Event, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})
Event.belongsTo(Building, {
  foreignKey: 'buildingId',
  onDelete: 'CASCADE'
})

const initializeDefaultAdmin = async () => {
  try {
    // Kiểm tra xem có admin nào đã tồn tại chưa
    const adminExists = await Admin.findOne();

    if (!adminExists) {
      // Tạo role cho admin nếu chưa có
      let adminRole = await Roles.findOne({ where: { roleName: 'Admin' } });

      if (!adminRole) {
        adminRole = await Roles.create({ roleName: 'Admin' });
      }

      // Tạo user cho admin
      const user = await User.create({
        fullname: 'Default Admin',
        username: 'admin',
        password: 'admin123', // Bạn nên mã hóa mật khẩu trước khi lưu
        email: 'admin@techhome.com',
        roleId: adminRole.roleId,
      });

      // Tạo admin với userId và roleId vừa tạo
      await Admin.create({
        userId: user.userId,
      });

      console.log('Default admin created successfully');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
};



module.exports = {
  initializeDefaultAdmin,
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
