const contactsModel = require('./contacts.model')

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const { favorite, page, limit } = req.query
      const filterObject = { owner: req.user }
      let contacts
      if (favorite) filterObject.favorite = favorite
      if (page && limit) {
        contacts = await contactsModel.paginate(filterObject, {
          page,
          limit,
        })
      } else {
        contacts = await contactsModel.find(filterObject)
      }
      return res.status(200).json(contacts)
    } catch (err) {
      next(err)
    }
  }

  async getContactById(req, res, next) {
    try {
      const contactId = req.params.contactId
      const contactById = await contactsModel.findById(contactId)
      if (contactById) {
        res.status(200).json(contactById)
      } else {
        return res.status(404).send()
      }
    } catch (err) {
      next(err)
    }
  }

  async addContact(req, res, next) {
    try {
      const newContact = await contactsModel.create({
        ...req.body,
        owner: req.user,
      })
      return res.status(201).json(newContact)
    } catch (err) {
      next(err)
    }
  }

  async deleteContact(req, res, next) {
    try {
      const contactId = req.params.contactId
      const deletedContact = await contactsModel.findByIdAndRemove(contactId)
      if (deletedContact) {
        return res.status(200).json({
          messsage: 'Contact successfully deleted.',
          contact: deletedContact,
        })
      } else {
        return res.status(404).send()
      }
    } catch (error) {
      next(error)
    }
  }

  async updateContact(req, res, next) {
    try {
      const contactId = req.params.contactId
      const updatedContact = await contactsModel.findByIdAndUpdate(
        contactId,
        req.body,
        { new: 'true' }
      )
      if (updatedContact) {
        return res.status(200).json(updatedContact)
      } else {
        return res.status(404).send()
      }
    } catch (error) {
      next(error)
    }
  }

  async updateStatusContact(req, res, next) {
    try {
      const contactId = req.params.contactId
      const status = req.body.favorite
      if (!status) {
        res.status(400).json({ message: 'missing field favorite' })
      }
      const updatedContact = await contactsModel.findByIdAndUpdate(
        contactId,
        { favorite: status },
        { new: 'true' }
      )
      if (updatedContact) {
        return res.status(200).json(updatedContact)
      } else {
        return res.status(404).send()
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ContactsController()
