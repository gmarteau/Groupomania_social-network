const express = require('express');
const router = express.Router();

const topicCtrl = require('../controllers/topic');

router.post('/', topicCtrl.createTopic);
router.get('/', topicCtrl.getTopicsNamesList);
router.get('/:id', topicCtrl.getTopicById);
router.delete('/:id', topicCtrl.deleteTopic);

module.exports = router;