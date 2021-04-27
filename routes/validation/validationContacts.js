const Joi = require("joi");
const mongoose = require('mongoose');

const schemaCreatContact = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "ru"] },
		})
		.required(),
	phone: Joi.string()
		.pattern(new RegExp("^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$"))
		.required(),
});

const schemaUpdateContact = Joi.object({
	name: Joi.string().min(3).max(30).optional(),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net"] },
		})
		.optional(),
	phone: Joi.string()
		.pattern(new RegExp("^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$"))
		.optional(),
}).or("name", "phone", "email");

const validation = async (schema, obj, next) => {
	try {
		await schema.validateAsync(obj);
		return next();
	} catch (error) {
		next({ status: 400, message: error.message.replace(/"/g, "'") });
	}
};

const validationCreatContact = async (req, res, next) => {
	return await validation(schemaCreatContact, req.body, next);
};

const validationUpdateContact = async (req, res, next) => {
	return await validation(schemaUpdateContact, req.body, next);
};

const validationObjectId = async (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
		return next({ status: 400, message: 'Invalid Object Id' });
	}
	next()
};

module.exports = {
	validationCreatContact,
	validationUpdateContact,
	validationObjectId,
};