const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validations');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.use(auth);
// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMovies);

// создаёт фильм с переданными в теле
router.post('/movies', validateCreateMovie, createMovie);

// удаляет сохранённый фильм по id
router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
