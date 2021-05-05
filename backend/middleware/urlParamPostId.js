const seq = require('../sequelize');
const Post = seq.post;

module.exports = async (req, res, next, postId) => {
    const post = await Post.findOne({
        where: {
            id: postId
        }
    });
    if (!post) {
        return res.status(400).json({ error: 'Aucun post ne correspond à l\'id donné en URL' });
    } else {
        req.post = post;
        next();    
    }
};