const { DataTypes } = require('sequelize')

const complainModel = {
  complaintId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  complaintTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  complaintDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complaintDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  complaintStatus: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Buildings',
      key: 'buildingId'
    }
  },
  floorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Floors',
      key: 'floorId'
    }
  },
  apartmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Apartments',
      key: 'apartmentId'
    }
  }
}

module.exports = complainModel
