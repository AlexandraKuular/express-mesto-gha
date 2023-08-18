const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const InternalError = require('./middlewares/internalError');
const { validationLogin, validationRegister } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const {
  addUser, login,
} = require('./controllers/users');
const { ERROR_NOT_FOUND_CODE } = require('./constants/networkStatuses');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use(express.json());

app.post('/signup', validationRegister, addUser);
app.post('/signin', validationLogin, login);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND_CODE).send({ message: `Ресурс по адресу ${req.path} не найден.` });
});
app.use(errors());
app.use(InternalError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
