const UsersModel = require('./users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UsersController {
  constructor() {
    this.saltRounds = 6
  }

  get signUp() {
    return this._signUp.bind(this)
  }

  async _signUp(req, res, next) {
    try {
      const { email, password } = req.body
      const existingUser = await UsersModel.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: 'Email in use' })
      }

      const hash = await bcrypt.hash(password, this.saltRounds)

      const newUser = await UsersModel.create({ ...req.body, password: hash })

      if (newUser) {
        return res.status(201).json({ user: newUser })
      }
    } catch (error) {
      next(error)
    }
  }

  async logIn(req, res, next) {
    try {
      const { email, password } = req.body
      const existingUser = await UsersModel.findOne({ email })

      if (!existingUser) {
        return res.status(401).json({ message: 'Email or password is wrong' })
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      )

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email or password is wrong' })
      }

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET)

      const userWithToken = await UsersModel.findByIdAndUpdate(
        existingUser._id,
        { token }
      )

      return res.status(200).json({
        token,
        user: {
          email: userWithToken.email,
          subscription: userWithToken.subscription,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async authorize(req, res, next) {
    try {
      const authHeader = req.get('Authorization')
      if (!authHeader) {
        return res.status(400).json({ message: 'Token not found.' })
      }
      const token = authHeader.replace('Bearer ', '')

      const userId = jwt.verify(token, process.env.JWT_SECRET).id

      const user = await UsersModel.findById(userId)

      if (!user || user.token !== token) {
        return res.status(401).json({ message: 'Not authorized' })
      }
      req.user = user
      next()
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: error.message })
      }
      next(error)
    }
  }

  async logOut(req, res, next) {
    try {
      await UsersModel.findByIdAndUpdate(req.user._id, { token: null })
      return res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { email, subscription } = req.user
      return res.status(200).json({ email, subscription })
    } catch (error) {
      next(error)
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const mergedData = {
        ...req.user._doc,
        subscription: req.body.subscription,
      }
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.user._id,
        mergedData,
        { new: 'true' }
      )
      return res.status(200).json(updatedUser)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UsersController()
