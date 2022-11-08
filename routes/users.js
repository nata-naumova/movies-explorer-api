const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateUpdateUser } = require('../middlewares/validations');

const {
  getUsers,
  updateUser,
} = require('../controllers/users');

router.use(auth);

router.get('/users/me', getUsers);

router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
