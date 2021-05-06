const express = require('express');
const router = express.Router();
const userUniqueValidator = require('../middleware/userUniqueValidator');
const multer = require('../middleware/multer-config');

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userUniqueValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', userCtrl.getUserProfile);
router.put('/:id', multer, userCtrl.updateUserProfile);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;