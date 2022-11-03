const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
// const { LINK_REGEX } = require('../constants');
const auth = require('../middlewares/auth');

const app = express();

// создаёт пользователя с переданными в теле email, password и name
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

// проверяет переданные в теле почту и пароль и возвращает JWT
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use(userRouter);
app.use(movieRouter);

app.use('*', (req, res, next) => next(new NotFoundError(`Страницы по адресу ${req.baseUrl} не существует`)));

module.exports = app;
