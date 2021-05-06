const { Op } = require('sequelize');
const seq = require('../sequelize');
const Post = seq.post;
const User = seq.user;

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
    if (req.query.order == 'recent') {
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
    } else if (req.query.order == 'popular') {
        Post.findAll({
            include: {
                model: User,
                attributes: ['username', 'firstName', 'lastName', 'profilePicture']
            },
            where: {
                TopicId: req.topic.dataValues.id
            },
            order: [
                ['likes', 'DESC']
            ]
        })
            .then(posts => res.status(200).json(posts))
            .catch(error => res.status(400).json({ error }));
    }
};

exports.getPostById = (req, res, next) => {
    Post.findOne({
        include: {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'profilePicture']
        },
        where: {
            [Op.and]: [
                { id: req.params.id },
                { TopicId: req.topic.dataValues.id }
            ]
        }
    })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
};

exports.updatePost = (req, res, next) => {
    Post.findOne({
        where: {
            [Op.and]: [
                { id: req.params.id },
                { TopicId: req.topic.dataValues.id }
            ]
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
                        [Op.and]: [
                            { id: req.params.id },
                            { TopicId: req.topic.dataValues.id }
                        ]
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
            [Op.and]: [
                { id: req.params.id },
                { TopicId: req.topic.dataValues.id }
            ]
        }
    })
        .then(post => {
            if (post.UserId !== req.body.userId) {
                return res.status(401).json({ error: 'Seul le créateur du post peut le supprimer' });
            } else {
                Post.destroy({
                    where: {
                        [Op.and]: [
                            { id: req.params.id },
                            { TopicId: req.topic.dataValues.id }
                        ]
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
            [Op.and]: [
                { id: req.params.id },
                { TopicId: req.topic.dataValues.id }
            ]
        }
    })
        .then(post => {
            const userId = req.body.userId.toString();
            const hasLiked = Array.from(post.dataValues.hasLiked);
            const hasLikedFiltered = hasLiked.filter(char => char !== ',');
            const hasDisliked = Array.from(post.dataValues.hasDisliked);
            const hasDislikedFiltered = hasDisliked.filter(char => char !== ',');
            const alreadyLiked = hasLikedFiltered.includes(userId);
            const alreadyDisliked = hasDislikedFiltered.includes(userId);
            switch (req.body.like) {
                case 1:
                    if (alreadyLiked) {
                        return res.status(401).json({ error: 'L\'utilisateur a déjà aimé le post' });
                    } else if (alreadyDisliked) {
                        const index = hasDislikedFiltered.indexOf(userId);
                        hasDislikedFiltered.splice(index, 1);
                        post.dataValues.dislikes--;
                        hasLikedFiltered.push(userId);
                        post.dataValues.likes++;
                        Post.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            hasLiked: hasLikedFiltered.toString(),
                            dislikes: post.dataValues.dislikes,
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { TopicId: req.topic.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Post mis à jour avec le nouveau like' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if(!alreadyLiked && !alreadyDisliked) {
                        hasLikedFiltered.push(userId);
                        post.dataValues.likes++;
                        Post.update({
                            hasLiked: hasLikedFiltered.toString(),
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { TopicId: req.topic.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Post mis à jour avec le nouveau like' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case -1:
                    if (alreadyDisliked) {
                        return res.status(401).json({ error: 'L\'utilisateur a déjà disliké le post' });
                    } else if (alreadyLiked) {
                        const index = hasLikedFiltered.indexOf(userId);
                        hasLikedFiltered.splice(index, 1);
                        post.dataValues.likes--;
                        hasDislikedFiltered.push(userId);
                        post.dataValues.dislikes++;
                        Post.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            hasLiked: hasLikedFiltered.toString(),
                            dislikes: post.dataValues.dislikes,
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { TopicId: req.topic.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Post mis à jour avec le nouveau dislike' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if(!alreadyLiked && !alreadyDisliked) {
                        hasDislikedFiltered.push(userId);
                        post.dataValues.dislikes++;
                        Post.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            dislikes: post.dataValues.dislikes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { TopicId: req.topic.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Post mis à jour avec le nouveau dislike' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case 0:
                    if (alreadyLiked) {
                        const index = hasLikedFiltered.indexOf(userId);
                        hasLikedFiltered.splice(index, 1);
                        post.dataValues.likes--;
                        Post.update({
                            hasLiked: hasLikedFiltered.toString(),
                            likes: post.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { TopicId: req.topic.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Le like pour ce post a bien été retiré' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (alreadyDisliked) {
                        const index = hasDislikedFiltered.indexOf(userId);
                        hasDislikedFiltered.splice(index, 1);
                        post.dataValues.dislikes--;
                        Post.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            dislikes: post.dataValues.dislikes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { TopicId: req.topic.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Le dislike pour ce post a bien été retiré' }))
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