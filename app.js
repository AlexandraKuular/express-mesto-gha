const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_NOT_FOUND_CODE } = require('./constants/networkStatuses');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use((req, res, next) => {
  req.user = { _id: '64d0612e609e8a4edcee5809' };

  next();
});
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND_CODE).send({ message: `Ресурс по адресу ${req.path} не найден.` });
});
app.use(express.json());
app.use(bodyParser.json());
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
