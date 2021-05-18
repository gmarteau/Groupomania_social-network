const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const topicCtrl = require('../controllers/topic');
const auth = require('../middleware/auth');

router.post('/', multer, topicCtrl.createTopic);
router.get('/', topicCtrl.getTopics);
router.get('/:id', topicCtrl.getTopicById);
router.delete('/:id', topicCtrl.deleteTopic);
router.post('/:id/follow', topicCtrl.followTopic);

module.exports = router;