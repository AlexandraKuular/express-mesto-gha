const User = require('../models/user');
const { ERROR_CODE, ERROR_NOT_FOUND_CODE, INTERNAL_ERROR } = require('../constants/networkStatuses');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.setUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate({ name, about }, req.user._id, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate({ avatar }, req.user._id, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};
