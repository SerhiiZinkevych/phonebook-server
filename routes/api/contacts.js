const express = require('express')
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../model')
const {
  validateCreateUser,
  validateUpdateUser,
} = require('./contacts.validator')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const data = await listContacts()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contactById = await getContactById(Number(req.params.contactId))
    if (contactById) {
      res.json(contactById)
    } else {
      res.status = 404
      res.json({ message: 'Not found!' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.post('/', validateCreateUser, async (req, res, next) => {
  try {
    const createdUser = await addContact(req.body)
    res.status(201).json(createdUser)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId)
    const removedContact = await removeContact(contactId)
    if (removedContact) {
      res.status(200).json({ message: 'contact deleted' })
    } else {
      res.status(404).json({ message: 'Not found!' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.patch('/:contactId', validateUpdateUser, async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId)
    const updatedContact = await updateContact(contactId, req.body)
    if (updatedContact) {
      res.status(200).json(updatedContact)
    } else {
      res.status(404).json({ message: 'Not found!' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

module.exports = router
