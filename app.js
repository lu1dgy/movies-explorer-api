require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { PORT = 3000, DB_ADDRESS = 'mongodb://0.0.0.0:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(DB_ADDRESS)
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
