const express = require('express');
const router = express.Router();

const topicCtrl = require('../controllers/topic');

router.post('/', auth, topicCtrl.createTopic);
router.get('/', auth, topicCtrl.getTopicsNamesList);
router.get('/:id', auth, topicCtrl.getTopicById);
router.delete('/:id', auth, topicCtrl.deleteTopic);

module.exports = router;