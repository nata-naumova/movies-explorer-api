const express = require('express');
const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validations');
const { urlNotFound } = require('../utils/constants');

const app = express();

// создаёт пользователя с переданными в теле email, password и name
app.post('/signup', validateCreateUser, createUser);

// проверяет переданные в теле почту и пароль и возвращает JWT
app.post('/signin', validateLogin, login);

app.use(userRouter);
app.use(movieRouter);

app.use('*', (req, res, next) => next(new NotFoundError(`${urlNotFound} ${req.baseUrl}`)));

module.exports = app;
