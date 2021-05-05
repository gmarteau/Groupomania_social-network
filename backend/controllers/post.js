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

exports.likePost = (req, res, next) => {
    Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(post => {
            const userId = req.body.userId.toString();
            const hasLiked = Array.from(post.dataValues.hasLiked);
            const hasDisliked = Array.from(post.dataValues.hasDisliked);
            console.log(hasLiked);
            const alreadyLiked = hasLiked.includes(userId);
            const alreadyDisliked = hasDisliked.includes(userId);
            switch (req.body.like) {
                case 1:
                    if (alreadyLiked) {
                        return res.status(401).json({ error: 'L\'utilisateur a déjà aimé le post' });
                    } else if (alreadyDisliked) {
                        const index = hasDisliked.indexOf(userId);
                        hasDisliked.splice(index, 1);
                        post.dataValues.dislikes--;
                        hasLiked.push(userId);
                        post.dataValues.likes++;
                        Post.update({
                            hasDisliked: hasDisliked.toString(),
                            hasLiked: hasLiked.toString(),
                            dislikes: post.dataValues.dislikes,
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(res.status(200).json({ message: 'Post mis à jour avec le nouveau like' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if(!alreadyLiked && !alreadyDisliked) {
                        hasLiked.push(userId);
                        console.log(hasLiked);
                        post.dataValues.likes++;
                        Post.update({
                            hasLiked: hasLiked.toString(),
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(res.status(200).json({ message: 'Post mis à jour avec le nouveau like' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case -1:
                    if (alreadyDisliked) {
                        return res.status(401).json({ error: 'L\'utilisateur a déjà disliké le post' });
                    } else if (alreadyLiked) {
                        const index = hasLiked.indexOf(userId);
                        hasLiked.splice(index, 1);
                        post.dataValues.likes--;
                        hasDisliked.push(userId);
                        post.dataValues.dislikes++;
                        Post.update({
                            hasDisliked: hasDisliked.toString(),
                            hasLiked: hasLiked.toString(),
                            dislikes: post.dataValues.dislikes,
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(res.status(200).json({ message: 'Post mis à jour avec le nouveau dislike' }))
                            .catch(error => res.status(400).json({ error }));
                        } else if(!alreadyLiked && !alreadyDisliked) {
                        hasDisliked.push(userId);
                        post.dataValues.dislikes++;
                        Post.update({
                            hasDisliked: hasDisliked.toString(),
                            dislikes: post.dataValues.dislikes
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(res.status(200).json({ message: 'Post mis à jour avec le nouveau dislike' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case 0:
                    if (alreadyLiked) {
                        const index = hasLiked.indexOf(userId);
                        hasLiked.splice(index, 1);
                        post.dataValues.likes--;
                        Post.update({
                            hasLiked: hasLiked.toString(),
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(res.status(200).json({ message: 'Le like pour ce post a bien été retiré' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (alreadyDisliked) {
                        const index = hasDisliked.indexOf(userId);
                        hasDisliked.splice(index, 1);
                        post.dataValues.dislikes--;
                        Post.update({
                            hasDisliked: hasDisliked.toString(),
                            dislikes: post.dataValues.dislikes
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(res.status(200).json({ message: 'Le dislike pour ce post a bien été retiré' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if(!alreadyLiked && !alreadyDisliked) {
                        return res.status(400).json({ error: 'Aucune réaction à retirer' });
                    }
                    break;
                default:
                    return res.status(400).json({ error: 'like ne peut être égal à autre chose que 1, 0 ou -1' });
            }
        })
        .catch(error => res.status(400).json({ error }));
};