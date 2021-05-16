const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs').promises
const path = require('path')
require('dotenv').config()
const Users = require('../model/users')
const EmailService = require('../services/email')
const { responseHttp } = require('../helpers/constants')
const User = require('../model/schemas/user')


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const register = async (req, res, next) => {
    
    const user = await Users.findByEmail(req.body.email)
    if (user) {
        return res.status(responseHttp.CONFLICT).json({
            status: 'error',
            code: responseHttp.CONFLICT,
            message: 'Email in use',
        })
    }
    try {
        const newUser = await Users.createUser(req.body)
        const { id, name, email, subscription, avatarURL, verifyToken } = newUser

        try {
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyToken, email, name)
        } catch (error) {
            console.log(error.message)
        }
        return res.status(responseHttp.CREATED).json({
            status: 'success',
            code: responseHttp.CREATED,
            data: {
                id,
                email,
                subscription,
                avatarURL,
            },
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await Users.findByEmail(email)
        const isValidPassword = user ? await user.validPassword(password) : false
        if (!user || !isValidPassword || !user.verify) {
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
            data: { token },
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(responseHttp.NO_CONTENT).json({})
}

const updateAvatar = async (req, res, next) => {
    const { id } = req.user
    const avatarUrl = await saveAvatarUser(req)
    await Users.updateAvatar(id, avatarUrl)
    return res
        .status(responseHttp.Ok)
        .json({status: 'success', code: responseHttp.OK, data: {avatarUrl}})
}

const saveAvatarUser = async (req) => {
    const FOLDER_AVATARS = process.env.FOLDER_AVATARS
    //req.file
    const pathFile = req.file.path
    const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`
    const img = await jimp.read(pathFile)
    await img
        .autocrop()
        .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(pathFile)
    try {
        await fs.rename(pathFile, path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar))
    } catch (error) {
        console.log(error.message)
    }
    const oldAvatar = req.user.avatarURL
    if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
        await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
    }
    return path.join(FOLDER_AVATARS, newNameAvatar).replace('\\', '/')
}

const verify = async (req, res, next) => {
    try {
        const user = await User.findByVerifyTokenEmail(req.params.token)
        if (user) {
            await Users.updateVerifyToken(user.id, true, null)
            return res.status(responseHttp.OK).json({
            status: 'success',
            code: responseHttp.OK,
            data: {message: 'Verification successful'},
        })
        }
        return res.status(responseHttp.NOT_FOUND).json({
            status: 'error',
            code: responseHttp.NOT_FOUND,
            message: 'User not found',
        })
    } catch (error) {
        next(error)
    }
}

const repitEmailVerify = async (req, res, next) => {
    try {
        const user = await Users.findByEmail(req.body.email)
        if (user) {
            const { name, email, verifyToken } = user
        
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyToken, email, name)
            return res.status(responseHttp.OK).json({
            status: 'success',
            code: responseHttp.OK,
            data: {message: 'Verification email sent'},
        })
        }
        return res.status(responseHttp.BAD_REQUEST).json({
            status: 'error',
            code: responseHttp.BAD_REQUEST,
            message: 'Verification has already been passed',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    logout,
    updateAvatar,
    verify,
    repitEmailVerify,
}