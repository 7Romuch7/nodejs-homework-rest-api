const mongoose = require('mongoose')
const { Schema, model } = mongoose
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const {Subscription} = require ('../../helpers/constants')
const { nanoid } = require('nanoid')

const SALT_FACTOR = 6

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/
      return re.test(String(value).toLocaleLowerCase())
    }
  },
  subscription: {
    type: String,
    enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSSINES],
    default: Subscription.STARTER
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250' }, true)
    }
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, 'Verify token is required'],
    default: nanoid(),
  },
});

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        const salt = await bcrypt.genSaltSync(SALT_FACTOR)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)
  
module.exports = User