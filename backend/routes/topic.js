const express = require('express');
const router = express.Router();

const topicCtrl = require('../controllers/topic');

router.post('/', topicCtrl.createTopic);

module.exports = router;