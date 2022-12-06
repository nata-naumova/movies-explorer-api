const BAD_REQUEST = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOTFOUND_ERROR = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_SERVER_ERROR = 500;

const invalidDataErrorText = 'Переданы некорректные данные';
const forbiddenErrorText = 'Нельзя удалять фильмы других пользователей';
const invalidUserIdErrorText = 'Введен невалидный id пользователя';
const userIdNotFoundText = 'Нет пользователя с таким id';
const movieIdNotFoundErrorText = 'Нет фильма с таким id';
const duplicateEmailErrorText = 'Пользователь с таким email уже существует';
const wrongCredentialsErrorText = 'Неправильные почта или пароль';
const unauthorizedErrorText = 'Необходима авторизация';
const serverError = 'На сервере произошла ошибка.';
const urlFormatError = 'Некорректный адрес URL';
const urlNotFound = 'Запрашиваемый ресурс не найден, проверьте адрес: ';
const emailNotFound = 'Некорректный email';

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOTFOUND_ERROR,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
  invalidDataErrorText,
  forbiddenErrorText,
  invalidUserIdErrorText,
  userIdNotFoundText,
  movieIdNotFoundErrorText,
  duplicateEmailErrorText,
  wrongCredentialsErrorText,
  unauthorizedErrorText,
  serverError,
  urlFormatError,
  urlNotFound,
  emailNotFound,
};
