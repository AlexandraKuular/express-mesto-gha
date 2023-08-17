const Card = require('../models/card');
const ERROR_CODE = require('../errors/error_code');
const ERROR_NOT_FOUND_CODE = require('../errors/error_not_found_code');
const FORBIDDEN_ERROR = require('../errors/forbidden_error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ERROR_CODE('Переданы некорректные данные при создании пользователя.'));
      }
      return next();
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ERROR_CODE('Переданы некорректные данные при создании пользователя.'));
      }
      return next();
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new ERROR_NOT_FOUND_CODE('Передан несуществующий _id карточки.'));
      }
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(200));
      }
      return next(new FORBIDDEN_ERROR('Удалить чужую карточку нельзя.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_CODE('Карточка с указанным _id не найдена.'));
      }
      return next();
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ERROR_NOT_FOUND_CODE('Передан несуществующий _id карточки.'));
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_CODE('Переданы некорректные данные для постановки лайка.'));
      }
      return next();
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ERROR_NOT_FOUND_CODE('Передан несуществующий _id карточки.'));
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_CODE('Переданы некорректные данные для снятия лайка.'));
      }
      return next();
    });
};
