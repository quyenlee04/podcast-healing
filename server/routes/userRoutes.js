const express = require('express');
const router = express.Router();
const { register, login , getUserById, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/register',validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect,adminOnly, deleteUser);
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;