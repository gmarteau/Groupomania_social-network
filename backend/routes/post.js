const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

router.post('/', postCtrl.createPost);
router.get('/', postCtrl.getPosts);
router.get('/:id', postCtrl.getPostById);
router.put('/:id', postCtrl.updatePost);
router.delete('/:id', postCtrl.deletePost);
router.post('/:id/like', postCtrl.likePost);

module.exports = router;