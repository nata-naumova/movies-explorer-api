const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
// const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  invalidDataErrorText,
  // wrongCredentialsErrorText,
  userIdNotFoundText,
  duplicateEmailErrorText,
} = require('../utils/constants');
const { devJwtKey } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devJwtKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// Получение пользователей
module.exports.getUsers = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError(userIdNotFoundText)))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

// Создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(duplicateEmailErrorText);
      } else {
        bcrypt.hash(password, SALT_ROUNDS)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then((userData) => res.send({
            name: userData.name,
            id: userData._id,
            email: userData.email,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError(invalidDataErrorText));
            }
            if (err.code === 11000) {
              next(new ConflictError(duplicateEmailErrorText));
            }
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Обновление информации о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError(invalidDataErrorText));
      }
      if (err.code === 11000) {
        return next(new ConflictError(duplicateEmailErrorText));
      }
      return next(err);
    })
    .catch(next);
};
