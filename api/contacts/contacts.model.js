const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { Schema, SchemaTypes } = mongoose

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
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  },
})

ContactsSchema.plugin(mongoosePaginate)

const contactsModel = mongoose.model('Contacts', ContactsSchema)

module.exports = contactsModel
