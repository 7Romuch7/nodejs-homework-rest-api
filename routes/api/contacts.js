const express = require("express");
const router = express.Router();
const {
	getContactById,
	listContacts,
	removeContact,
	updateContact,
	addContact,
} = require("../../model/contacts.js");
const { responseHttp } = require("../../helpers/constants");
const {
	validationCreatContact,
	validationUpdateContact,
} = require("../validation/validationContacts");

router.get("/", async (req, res, next) => {
	try {
		const contacts = await listContacts();
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
});

router.get("/:contactId", async (req, res, next) => {
	try {
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
});

router.post("/", validationCreatContact, async (req, res, next) => {
	try {
		const contact = await addContact(req.body);
		return res.status(201).json({
			status: "success",
			code: responseHttp.CREATED,
			data: {
				contact,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.delete("/:contactId", async (req, res, next) => {
	try {
		const contact = await removeContact(req.params.contactId);
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
});

router.put("/:contactId", validationUpdateContact, async (req, res, next) => {
	try {
		if (!req.body) {
			return res.status(400).json({ message: "missing fields" });
		}
		const contact = await updateContact(req.params.contactId, req.body);
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
});

module.exports = router;