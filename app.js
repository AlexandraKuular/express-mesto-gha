const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('express').Router();
const { errors } = require('celebrate');
const INTERNAL_ERROR = require('./middlewares/internal_error');
const { validationLogin, validationRegister } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const {
  addUser, login,
} = require('./controllers/users');
const ERROR_NOT_FOUND_CODE = require('./errors/error_not_found_code');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
});

router.post('/signup', validationRegister, addUser);
router.post('/signin', validationLogin, login);

app.use(auth);
app.use(express.json());
app.use(bodyParser.json());
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND_CODE).send({ message: `Ресурс по адресу ${req.path} не найден.` });
});
app.use(errors());
app.use(INTERNAL_ERROR);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
