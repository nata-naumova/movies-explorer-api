const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Возвращает все фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
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

  const owner = req.user._id;

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
    owner,
  })
    .then((movie) => res.status(200).send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      thumbnail: movie.thumbnail,
      owner: movie.owner,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('400 — Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

// Удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('404 — Фильм не найден.');
      }
      if (!movies.owner.equals(req.user._id)) {
        throw new ForbiddenError('403 — Нельзя удалить чужой фильм. ');
      }
      return movies.remove().then(() => res.status(200).send(movies));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('400 — Ошибка обработки данных.'));
      }
      return next(err);
    });
};
