const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { wrongCredentialsErrorText, emailNotFound } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: { // почта пользователя, по которой он регистрируется
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: emailNotFound,
    },
  },
  password: { // хеш пароля
    type: String,
    required: true,
    select: false,
  },
  name: { // имя пользователя
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(wrongCredentialsErrorText));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(wrongCredentialsErrorText));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
