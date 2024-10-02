const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User, Resident } = require('../Model/ModelDefinition')
const { Op } = require('sequelize')

const jwtToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const activeResident = async (req, res) => {
  try {
    const { email, fullname, idcard, phonenumber, username, password } =
      req.body

    if (
      !email &&
      !idcard &&
      !phonenumber &&
      !username &&
      !password &&
      !fullname
    ) {
      return res.status(400).json({
        message:
          'Email, ID card, fullname, password or phone number is required'
      })
    }

    const conditions = []
    if (email) conditions.push({ email })
    if (username) conditions.push({ username })

    const user = await User.findOne({
      where: { [Op.or]: conditions }
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const conditionsResident = []

    if (idcard) conditionsResident.push({ idcard })
    if (phonenumber) conditionsResident.push({ phonenumber })

    const resident = await Resident.findOne({
      where: { [Op.or]: conditionsResident }
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    if (resident.userId !== user.userId) {
      return res.status(400).json({ message: 'Invalid resident' })
    }

    await User.update(conditions, { where: { userId: user.userId } })
    conditionsResident.push({ active: 'active' })
    await Resident.update(conditionsResident, {
      where: { residentId: resident.residentId }
    })

    res.status(200).json({ message: 'Resident activated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginResident = async (req, res) => {
  try {
    const { username, password, email, phonenumber, idcard } = req.body;

    if ((!username && !email && !phonenumber && !idcard) || !password) {
      return res.status(400).json({
        message: 'Username, email, phonenumber, idcard và password là bắt buộc'
      });
    }

    let user;
    let resident;

    // Nếu nhập username hoặc email, tìm kiếm User trước
    if (username || email) {
      user = await User.findOne({
        where: {
          [Op.or]: [
            username ? { username } : undefined,
            email ? { email } : undefined
          ].filter(Boolean)
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }

      resident = await Resident.findOne({
        where: {
          [Op.or]: [
            idcard ? { idcard } : undefined,
            phonenumber ? { phonenumber } : undefined,
            user.userId ? { userId: user.userId } : undefined
          ].filter(Boolean)
        }
      });

      if (!resident) {
        return res.status(400).json({ message: 'Resident does not exist' });
      }
    }

    if (phonenumber || idcard) {
      resident = await Resident.findOne({
        where: {
          [Op.or]: [
            idcard ? { idcard } : undefined,
            phonenumber ? { phonenumber } : undefined
          ].filter(Boolean)
        }
      });

      if (!resident) {
        return res.status(400).json({ message: 'Resident does not exist' });
      }

      user = await User.findOne({
        where: {
          userId: resident.userId
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    const token = jwtToken(user.userId);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { loginResident, activeResident }
