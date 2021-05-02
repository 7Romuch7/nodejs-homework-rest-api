const { responseHttp } = require('./constants')

const subscription = (subscription) => (req, res, next) => {
    const userSubscription = req.user.subscription
        if (userSubscription !== subscription) {
          return res.status(responseHttp.FORBIDDEN).json({
            status: 'error',
            code: responseHttp.FORBIDDEN,
            message: "Not authorized",
            })
        }
        req.user = user
        return next()
}

module.exports = subscription