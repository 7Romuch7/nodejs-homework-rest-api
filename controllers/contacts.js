const {
	getContactById,
	listContacts,
	removeContact,
	updateContact,
	addContact,
} = require("../model/contacts.js");

const { responseHttp } = require("../helpers/constants")

const getAllContacts = async (req, res, next) => {
	try {
		const userId = req.user ? req.user.id : false
		const contacts = await listContacts(userId, req.query);
		return res.json({
			status: "success",
			code: responseHttp.OK,
			data: {
				contacts,
			},
		});
	} catch (error) {
		next(error);
	}
}

const getById = async (req, res, next) => {
	try {
		const userId = req.user ? req.user.id : false
		const contact = await getContactById(req.params.contactId);
		if (contact) {
			return res.json({
				status: "success",
				code: responseHttp.OK,
				data: {
					contact,
				},
			});
		} else {
			return res.status(404).json({
				status: "error",
				code: responseHttp.NOT_FOUND,
				data: "Not Found",
			});
		}
	} catch (error) {
		next(error);
	}
}

const createContact = async (req, res, next) => {
	try {
		const userId = req.user ? req.user.id : false
		const contact = await addContact(userId, req.body);
		return res.status(201).json({
			status: "success",
			code: responseHttp.CREATED,
			data: {
				contact,
			},
		})
	} catch (error) {
		next(error)
	}
}

const deleteContact = async (req, res, next) => {
	try {

		const userId = req.user ? req.user.id : false
		const contact = await removeContact(userId, req.params.contactId);
		if (contact) {
			return res.json({
				status: "success",
				code: responseHttp.OK,
				data: {
					message: "contact deleted",
				},
			});
		} else {
			return res.status(404).json({
				status: "error",
				code: responseHttp.NOT_FOUND,
				data: "Not Found",
			});
		}
	} catch (error) {
		next(error);
	}
}

const update = async (req, res, next) => {
	try {
		const userId = req.user ? req.user.id : false
		if (!req.body) {
			return res.status(400).json({ message: "missing fields" });
		}
		const contact = await updateContact(userId, req.params.contactId, req.body);
		if (contact) {
			return res.json({
				status: "success",
				code: responseHttp.OK,
				data: {
					contact,
				},
			});
		} else {
			return res.status(404).json({
				status: "error",
				code: responseHttp.NOT_FOUND,
				data: "Not Found",
			});
		}
	} catch (error) {
		next(error);
	}
}

const updateStatus = async (req, res, next) => {
	try {
		const userId = req.user ? req.user.id : false
		if (!req.body) {
			return res.status(400).json({ message: "missing fields favorite" });
		}
		const contact = await updateStatusContact(userId, req.params.contactId, req.body);
		if (contact) {
			return res.json({
				status: "success",
				code: responseHttp.OK,
				data: {
					contact,
				},
			});
		} else {
			return res.status(404).json({
				status: "error",
				code: responseHttp.NOT_FOUND,
				data: "Not Found",
			});
		}
	} catch (error) {
		next(error);
	}
}

const subscriptionStarter = async (req, res, next) => {
  return res.json({
  status: 'success',
  code: 200,
  data: { message: 'Starter only!', },
  })
}

const subscriptionPro = async (req, res, next) => {
  return res.json({
  status: 'success',
  code: 200,
  data: { message: 'Pro only!', },
  })
}

const subscriptionBusiness = async (req, res, next) => {
  return res.json({
  status: 'success',
  code: 200,
  data: { message: 'Business only!', },
  })
}

module.exports = {
    getAllContacts,
    getById,
    createContact,
    update,
    updateStatus,
	deleteContact,
	subscriptionStarter,
	subscriptionPro,
	subscriptionBusiness
}