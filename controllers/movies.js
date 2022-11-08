const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  invalidDataErrorText,
  forbiddenErrorText,
  movieIdNotFoundErrorText,
} = require('../utils/constants');

// Возвращает все фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie.reverse()))
    .catch((err) => {
      next(err);
    });
};

// Создание фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(invalidDataErrorText));
      }
      return next(err);
    });
};

// Удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError(movieIdNotFoundErrorText)))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError(forbiddenErrorText));
      } else {
        movie.remove()
          .then(() => res.send({ message: movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(invalidDataErrorText);
      }
      next(err);
    });
};
