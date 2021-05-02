const Users = require('../model/users')
const { responseHttp } = require('../helpers/constants')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.JWT_SECRET_KEY

const register = async (req, res, next) => {
    const { email } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
        return res.status(responseHttp.CONFLICT).json({
            status: 'error',
            code: responseHttp.CONFLICT,
            message: 'Email in use',
        })
    }
    try {
        const newUser = await Users.createUser(req.body)
        return res.status(responseHttp.CREATED).json({
            status: 'success',
            code: responseHttp.CREATED,
            data: {
                id: newUser.id,
                email: newUser.email,
                subscription: newUser.subscription,
            },
        })
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = user ? await user.validPassword(password) : false
    if (!user || isValidPassword) {
        return res.status(responseHttp.UNAUTHORIZED).json({
            status: 'error',
            code: responseHttp.UNAUTHORIZED,
            message: "Email or password is wrong",
        })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(user.id, token)
    return res.status(responseHttp.OK).json({
            status: 'success',
            code: responseHttp.OK,
            data: {token},
        })
}

const logout = async (req, res, next) => {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(responseHttp.NO_CONTENT).json({})
}

module.exports = {
    register,
    login,
    logout,
}