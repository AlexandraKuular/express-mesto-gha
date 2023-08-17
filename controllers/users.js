const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ERROR_CODE = require('../errors/error_code');
const ERROR_NOT_FOUND_CODE = require('../errors/error_not_found_code');
const CONFLICT_ERROR = require('../errors/conflict_error');
const UNAUTHORIZED_ERROR = require('../errors/unauthorized_error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ERROR_CODE('Переданы некорректные данные при создании пользователя.'));
      }
      return next();
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new ERROR_NOT_FOUND_CODE('Пользователь по указанному _id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_CODE('Переданы некорректные данные.'));
      }
      return next();
    });
};

module.exports.addUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);

  User.create({
    name, about, avatar, email, password: hash,
  })
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return next(new CONFLICT_ERROR('Пользователь с таким email уже существует.'));
      }
      if (err.name === 'ValidationError') {
        return next(new ERROR_CODE('Переданы некорректные данные при создании пользователя.'));
      }
      return next();
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then(() => {
          const token = jwt.sign({ _id: user._id }, 'some-secret-key');

          // вернём токен
          res.send({ token });
        });
    })
    .catch(() => {
      next(new UNAUTHORIZED_ERROR('Присланный токен некорректен.'));
    });
};

module.exports.setUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new ERROR_NOT_FOUND_CODE('Пользователь с указанным _id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ERROR_CODE('Переданы некорректные данные при обновлении профиля.'));
      }
      return next();
    });
};

module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new ERROR_NOT_FOUND_CODE('Пользователь с указанным _id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ERROR_CODE('Переданы некорректные данные при обновлении аватара.'));
      }
      return next();
    });
};

module.exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    return res.send(user);
  } catch (err) {
    return next();
  }
};
