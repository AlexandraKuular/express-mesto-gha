const Card = require('../models/card');
const ErrorCode = require('../errors/errorCode');
const ErrorNotFoundCode = require('../errors/errorNotFoundCode');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      // if (err.name === 'ValidationError') {
      //  return next(new ErrorCode('Переданы некорректные данные при создании пользователя.'));
      // }
      // return next();
      next(err);
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
        throw new ErrorCode('Переданы некорректные данные при создании пользователя.');
      }
      return next();
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFoundCode('Передан несуществующий _id карточки.');
      }
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(200));
      } else {
        throw new ForbiddenError('Удалить чужую карточку нельзя.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorCode('Карточка с указанным _id не найдена.');
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
        throw new ErrorNotFoundCode('Передан несуществующий _id карточки.');
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Переданы некорректные данные для постановки лайка.'));
      }
      next(err);
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
        return next(new ErrorNotFoundCode('Передан несуществующий _id карточки.'));
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Переданы некорректные данные для снятия лайка.'));
      }
      next(err);
    });
};
