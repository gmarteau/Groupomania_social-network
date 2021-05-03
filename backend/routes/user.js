const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', userCtrl.getUserProfile);
router.put('/:id', userCtrl.updateUserProfile);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;