const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

router.post('/', auth, postCtrl.createPost);
router.get('/', auth, postCtrl.getPosts);
router.get('/:id', auth, postCtrl.getPostById);
router.put('/:id', auth, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router;