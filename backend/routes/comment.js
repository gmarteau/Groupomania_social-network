const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.post('/', commentCtrl.createComment);
router.get('/', commentCtrl.getComments);
router.get('/:id', commentCtrl.getCommentById);
router.put('/:id', commentCtrl.updateComment);
router.delete('/:id', commentCtrl.deleteComment);
router.post('/:id/like', commentCtrl.likeComment);

module.exports = router;