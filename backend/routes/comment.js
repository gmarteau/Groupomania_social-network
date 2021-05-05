const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');

router.post('/', auth, commentCtrl.createComment);
router.get('/', auth, commentCtrl.getComments);
router.get('/:id', auth, commentCtrl.getCommentById);
router.put('/:id', auth, commentCtrl.updateComment);
router.delete('/:id', auth, commentCtrl.deleteComment);
router.post('/:id/like', auth, commentCtrl.likeComment);

module.exports = router;