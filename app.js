require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { limiter, devDatabaseUrl } = require('./utils/config');
const cors = require('./middlewares/cors');
const routes = require('./routes');
const mainErrors = require('./middlewares/main-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;

const app = express();

// МИДЛВАРЫ
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors);
app.use(limiter); // подключаем rate-limiter
app.use(helmet());
// Подключаем роуты
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);
app.use(errorLogger);
// Централизованная обработка ошибок
app.use(errors());
app.use(mainErrors);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : devDatabaseUrl);
app.listen(PORT);

/* = = =
  В файле .env записаны следующие данные:
  NODE_ENV = production
  JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b'
  PORT = 3000
  DATABASE_URL = 'mongodb://localhost:27017/moviesdb'
   = = =
*/
