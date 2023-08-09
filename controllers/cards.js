const Card = require('../models/card');
const { ERROR_CODE, ERROR_NOT_FOUND_CODE, INTERNAL_ERROR } = require('../constants/networkStatuses');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
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

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res
        .status(INTERNAL_ERROR)
        .send({ message: `Произошл ошибка ${err.name}: ${err.message}` });
    });
};
