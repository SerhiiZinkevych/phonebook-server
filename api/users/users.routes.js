const express = require('express')
const UsersController = require('./users.controller')
const UsersValidator = require('./users.validators')

const UserRouter = express.Router()

UserRouter.patch(
  '/',
  UsersController.authorize,
  UsersValidator.validateSubscription,
  UsersController.updateSubscription
)

UserRouter.post('/signup', UsersValidator.validateAuth, UsersController.signUp)

UserRouter.post('/login', UsersValidator.validateAuth, UsersController.logIn)

UserRouter.post('/logout', UsersController.authorize, UsersController.logOut)

UserRouter.get(
  '/current',
  UsersController.authorize,
  UsersController.getCurrentUser
)

module.exports = UserRouter
