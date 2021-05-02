const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/contacts')

const {
	validationQueryContact,
	validationCreatContact,
	validationUpdateContact,
	validationObjectId,
} = require("./validation/validationContacts")

const guard = require('../../helpers/guard')
const subscription = require('../../helpers/subscriptions')
const {Subscription} = require('../../helpers/constants')

const handleError = require('../../helpers/hendle-error')

router.get("/", guard, validationQueryContact, ctrl.getAllContacts)
	.post("/", guard, validationCreatContact, handleError, ctrl.createContact)

router.get('/starter', guard, subscription(Subscription.STARTER), ctrl.subscriptionStarter)
router.get('/pro', guard, subscription(Subscription.PRO), ctrl.subscriptionPro)
router.get('/business', guard, subscription(Subscription.BUSSINES), ctrl.subscriptionBusiness)

router
	.get("/:contactId", guard, validationObjectId, ctrl.getById)
	.put("/:contactId", guard, validationUpdateContact, ctrl.update)
	.patch('/:contactId/favorite', guard, ctrl.updateStatus)
	.delete("/:contactId", guard, ctrl.deleteContact)

module.exports = router;