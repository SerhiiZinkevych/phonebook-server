const express = require('express')

const {
  getContacts,
  addContact,
  getContactById,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require('./contacts.controller')

const {
  validateCreateUser,
  validateUpdateUser,
  validateId,
} = require('./contacts.validators')

const contactsRouter = express.Router()

contactsRouter.get('/', getContacts)
contactsRouter.get('/:contactId', validateId, getContactById)

contactsRouter.post('/', validateCreateUser, addContact)

contactsRouter.delete('/:contactId', validateId, deleteContact)

contactsRouter.patch(
  '/:contactId',
  validateId,
  validateUpdateUser,
  updateContact
)
contactsRouter.patch('/:contactId/favorite', validateId, updateStatusContact)

module.exports = contactsRouter
