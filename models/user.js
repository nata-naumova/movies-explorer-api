const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

// const { LINK_REGEX } = require('../constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: { // почта пользователя, по которой он регистрируется
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Некорректный email',
    },
  },
  password: { // хеш пароля
    type: String,
    required: true,
    select: false,
  },
  name: { // имя пользователя
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Мария',
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
