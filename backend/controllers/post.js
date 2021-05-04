const seq = require('../sequelize');
const Post = seq.post;
const User = seq.user;
const Topic = seq.topic;

exports.createPost = (req, res, next) => {
    Post.create({
        TopicId: req.topic.dataValues.id,
        UserId: req.body.userId,
        content: req.body.content
    })
        .then(() => res.status(201).json({ message: 'Post créé' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getPosts = (req, res, next) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'profilePicture']
        },
        where: {
            TopicId: req.topic.dataValues.id
        },
        order: [
            ['datePublication', 'DESC']
        ]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

exports.getPostById = (req, res, next) => {
    Post.findOne({
        include: {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'profilePicture']
        },
        where: {
            id: req.params.id
        }
    })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
};

exports.updatePost = (req, res, next) => {
    Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(post => {
            if (post.UserId !== req.body.userId) {
                return res.status(401).json({ error: 'Seul le créateur du post peut le modifier' });
            } else {
                Post.update({
                    content: req.body.content
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                    .then(() => res.status(200).json({ message: 'Post mis à jour' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
    Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(post => {
            if (post.UserId !== req.body.userId) {
                return res.status(401).json({ error: 'Seul le créateur du post peut le supprimer' });
            } else {
                Post.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(() => res.status(200).json({ message: 'Post supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};