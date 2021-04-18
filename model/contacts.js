const fs = require("fs").promises
const path = require("path")
const shortid = require('shortid');

const contactsPath = path.join("model", "./contacts.json");
const readContacts = () =>
	fs.readFile(contactsPath).then((data) => JSON.parse(data.toString()));

const listContacts = async () => {
	return readContacts();
};

const getContactById = async (contactId) => {
	const contacts = await readContacts();
	const numberId = Number(contactId) || contactId;
	const findContact = contacts.find((contact) => contact.id === numberId);
	return findContact;
};

const removeContact = async (contactId) => {
	const contacts = await readContacts();
	const numberId = Number(contactId) || contactId;
	const checkId = contacts.find((contact) => contact.id === numberId);
	const filterContacts = contacts.filter(
		(contact) => contact.id !== numberId
	);
	await fs.writeFile(contactsPath, JSON.stringify(filterContacts));
	return checkId;
};

const addContact = async (body) => {
	const id = shortid.generate();
	const contact = {
		id,
		...body,
	};
	const contacts = await readContacts();
	contacts.push(contact);
	await fs.writeFile(contactsPath, JSON.stringify(contacts));
	return contact;
};

const updateContact = async (contactId, body) => {
	const contacts = await readContacts();
	const numberId = Number(contactId) || contactId;
	const checkId = contacts.find((contact) => contact.id === numberId);

	const update = {
		...checkId,
		...body,
	};
	const updateList = contacts.map((contact) => {
		if (contact.id === numberId) {
			contact = update;
		}
		return contact;
	});

	await fs.writeFile(contactsPath, JSON.stringify(updateList));
	return update.id ? update : null;
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};