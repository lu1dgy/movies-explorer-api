require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { cors } = require('./middlewares/cors');
const rateLimiter = require('./utils/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const rootRouter = require('./routes/index');

const { PORT = 3100, DB_ADDRESS = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(helmet());

mongoose
  .connect(DB_ADDRESS)
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  });

app.use(cors);

app.use(rateLimiter);

app.use(rootRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
