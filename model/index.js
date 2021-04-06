const fs = require('fs/promises')
const path = require('path')

const contactsPath = path.join(__dirname, './contacts.json')

async function getContactsFromFile() {
  const contactsText = await fs.readFile(contactsPath, 'utf-8')
  const contacts = JSON.parse(contactsText)
  return contacts
}

const listContacts = async () => {
  const contacts = getContactsFromFile()
  return contacts
}

const getContactById = async (contactId) => {
  const contacts = await getContactsFromFile()
  const contactById = contacts.find((contact) => contact.id === contactId)
  return contactById
}

const removeContact = async (contactId) => {
  const contacts = await getContactsFromFile()
  const contactById = contacts.find((contact) => contact.id === contactId)
  if (contactById) {
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    )
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts), 'utf-8')
    return contactById
  }
}

const addContact = async ({ name, email, phone }) => {
  const contacts = await getContactsFromFile()
  const allIds = contacts.map((contact) => contact.id)
  const maxId = Math.max(...allIds)
  const newContact = { id: maxId + 1, name, email, phone }
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts), 'utf-8')
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await getContactsFromFile()
  const contactById = contacts.find((contact) => contact.id === contactId)
  if (contactById) {
    const newContacts = contacts.map((contact) => {
      if (contact.id === contactId) {
        return { ...contact, ...body }
      } else return contact
    })
    await fs.writeFile(contactsPath, JSON.stringify(newContacts), 'utf-8')

    return getContactById(contactId)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
