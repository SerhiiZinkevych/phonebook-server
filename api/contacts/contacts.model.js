const mongoose = require('mongoose')
const { Schema } = mongoose

const ContactsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
})

const contactsModel = mongoose.model('Contacts', ContactsSchema)

module.exports = contactsModel
