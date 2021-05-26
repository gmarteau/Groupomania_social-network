const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const topicCtrl = require('../controllers/topic');
const auth = require('../middleware/auth');

router.post('/', auth, multer, topicCtrl.createTopic);
router.get('/', auth, topicCtrl.getTopics);
router.get('/:id', auth, topicCtrl.getTopicById);
router.delete('/:id', auth, topicCtrl.deleteTopic);
router.post('/:id/follow', auth, topicCtrl.followTopic);

module.exports = router;