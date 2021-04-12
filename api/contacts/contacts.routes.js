const express = require('express')
const UsersController = require('../users/users.controller')

const ContactsController = require('./contacts.controller')

const ContactsValidator = require('./contacts.validators')

const contactsRouter = express.Router()

contactsRouter.get(
  '/',
  UsersController.authorize,
  ContactsController.getContacts
)
contactsRouter.get(
  '/:contactId',
  UsersController.authorize,
  ContactsValidator.validateId,
  ContactsValidator.isOwnerByContactID,
  ContactsController.getContactById
)

contactsRouter.post(
  '/',
  UsersController.authorize,
  ContactsValidator.validateCreateUser,
  ContactsController.addContact
)

contactsRouter.delete(
  '/:contactId',
  UsersController.authorize,
  ContactsValidator.validateId,
  ContactsValidator.isOwnerByContactID,
  ContactsController.deleteContact
)

contactsRouter.patch(
  '/:contactId',
  UsersController.authorize,
  ContactsValidator.validateId,
  ContactsValidator.validateUpdateUser,
  ContactsValidator.isOwnerByContactID,
  ContactsController.updateContact
)
contactsRouter.patch(
  '/:contactId/favorite',
  UsersController.authorize,
  ContactsValidator.validateId,
  ContactsValidator.isOwnerByContactID,
  ContactsController.updateStatusContact
)

module.exports = contactsRouter
