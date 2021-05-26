const { Op } = require('sequelize');
const seq = require('../sequelize');
const Comment = seq.comment;
const User = seq.user;
const Post = seq.post;
const xss = require('xss');

exports.createComment = (req, res, next) => {
    Comment.create({
        PostId: req.post.dataValues.id,
        UserId: req.body.userId,
        content: xss(req.body.content)
    })
        .then(() => {
            Post.findOne({
                where: {
                    id: req.post.dataValues.id
                }
            })
                .then(post => {
                    post.dataValues.numberOfComments++;
                    Post.update({
                        numberOfComments: post.dataValues.numberOfComments
                    }, {
                        where: {
                            id: req.post.dataValues.id
                        }
                    })
                        .then(res.status(201).json({ message: 'Commentaire créé' }))
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getComments = (req, res, next) => {
    if (req.query.order == 'recent') {
        Comment.findAll({
            include: {
                model: User,
                attributes: ['username', 'firstName', 'lastName', 'profilePicture']
            },
            where: {
                PostId: req.post.dataValues.id
            },
            order: [
                ['datePublication', 'DESC']
            ]
        })
            .then(comments => res.status(200).json(comments))
            .catch(error => res.status(400).json({ error }));    
    } else if (req.query.order == 'popular') {
        Comment.findAll({
            include: {
                model: User,
                attributes: ['username', 'firstName', 'lastName', 'profilePicture']
            },
            where: {
                PostId: req.post.dataValues.id
            },
            order: [
                ['likes', 'DESC']
            ]
        })
            .then(comments => res.status(200).json(comments))
            .catch(error => res.status(400).json({ error }));    
    }
};

exports.getCommentById = (req, res, next) => {
    Comment.findOne({
        include: {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'profilePicture']
        },
        where: {
            [Op.and]: [
                { id: req.params.id },
                { PostId: req.post.dataValues.id }
            ]
        }
    })
        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(400).json({ error }));
};

exports.updateComment = (req, res, next) => {
    Comment.findOne({
        where: {
            [Op.and]: [
                { id: req.params.id },
                { PostId: req.post.dataValues.id }
            ]
        }
    })
        .then(comment => {
            if (comment.UserId !== req.body.userId) {
                return res.status(401).json({ error: 'Seul le créateur du commentaire peut le modifier' });
            } else {
                Comment.update({
                    content: xss(req.body.content)
                }, {
                    where: {
                        [Op.and]: [
                            { id: req.params.id },
                            { PostId: req.post.dataValues.id }
                        ]
                    }
                })
                    .then(() => res.status(200).json({ message: 'Commentaire mis à jour' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    Comment.findOne({
        where: {
            [Op.and]: [
                { id: req.params.id },
                { PostId: req.post.dataValues.id }
            ]
        }
    })
        .then(comment => {
            if (comment.UserId !== req.body.userId) {
                return res.status(401).json({ error: 'Seul l\'auteur du commentaire peut le supprimer' });
            } else {
                Comment.destroy({
                    where: {
                        [Op.and]: [
                            { id: req.params.id },
                            { PostId: req.post.dataValues.id }
                        ]
                    }
                })
                    .then(() => {
                        Post.findOne({
                            where: {
                                id: req.post.dataValues.id
                            }
                        })
                            .then(post => {
                                post.dataValues.numberOfComments--;
                                Post.update({
                                    numberOfComments: post.dataValues.numberOfComments
                                }, {
                                    where: {
                                        id: req.post.dataValues.id
                                    }
                                })
                                    .then(res.status(200).json({ message: 'Commentaire supprimé' }))
                                    .catch(error => res.status(500).json({ error }));
                            })
                            .catch(error => res.status(400).json({ error }));            
                    }) 
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.likeComment = (req, res, next) => {
    Comment.findOne({
        where: {
            [Op.and]: [
                { id: req.params.id },
                { PostId: req.post.dataValues.id }
            ]
        }
    })
        .then(comment => {
            const userId = req.body.userId.toString();
            const hasLiked = Array.from(comment.dataValues.hasLiked);
            const hasLikedFiltered = hasLiked.filter(char => char !== ',');
            const hasDisliked = Array.from(comment.dataValues.hasDisliked);
            const hasDislikedFiltered = hasDisliked.filter(char => char !== ',');
            const alreadyLiked = hasLikedFiltered.includes(userId);
            const alreadyDisliked = hasDislikedFiltered.includes(userId);
            switch (req.body.like) {
                case 1:
                    if (alreadyLiked) {
                        return res.status(401).json({ error: 'L\'utilisateur a déjà aimé le commentaire' });
                    } else if (alreadyDisliked) {
                        const index = hasDislikedFiltered.indexOf(userId);
                        hasDislikedFiltered.splice(index, 1);
                        comment.dataValues.dislikes--;
                        hasLikedFiltered.push(userId);
                        comment.dataValues.likes++;
                        Comment.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            hasLiked: hasLikedFiltered.toString(),
                            dislikes: comment.dataValues.dislikes,
                            likes: comment.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { PostId: req.post.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Commentaire mis à jour avec le nouveau like' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if(!alreadyLiked && !alreadyDisliked) {
                        hasLikedFiltered.push(userId);
                        comment.dataValues.likes++;
                        Comment.update({
                            hasLiked: hasLikedFiltered.toString(),
                            likes: comment.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { PostId: req.post.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Commentaire mis à jour avec le nouveau like' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case -1:
                    if (alreadyDisliked) {
                        return res.status(401).json({ error: 'L\'utilisateur a déjà disliké le commentaire' });
                    } else if (alreadyLiked) {
                        const index = hasLikedFiltered.indexOf(userId);
                        hasLikedFiltered.splice(index, 1);
                        comment.dataValues.likes--;
                        hasDislikedFiltered.push(userId);
                        comment.dataValues.dislikes++;
                        Comment.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            hasLiked: hasLikedFiltered.toString(),
                            dislikes: comment.dataValues.dislikes,
                            likes: comment.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { PostId: req.post.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Commentaire mis à jour avec le nouveau dislike' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if(!alreadyLiked && !alreadyDisliked) {
                        hasDislikedFiltered.push(userId);
                        comment.dataValues.dislikes++;
                        Comment.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            dislikes: comment.dataValues.dislikes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { PostId: req.post.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Commentaire mis à jour avec le nouveau dislike' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case 0:
                    if (alreadyLiked) {
                        const index = hasLikedFiltered.indexOf(userId);
                        hasLikedFiltered.splice(index, 1);
                        comment.dataValues.likes--;
                        Comment.update({
                            hasLiked: hasLikedFiltered.toString(),
                            likes: comment.dataValues.likes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { PostId: req.post.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Le like pour ce commentaire a bien été retiré' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (alreadyDisliked) {
                        const index = hasDislikedFiltered.indexOf(userId);
                        hasDislikedFiltered.splice(index, 1);
                        comment.dataValues.dislikes--;
                        Comment.update({
                            hasDisliked: hasDislikedFiltered.toString(),
                            dislikes: comment.dataValues.dislikes
                        }, {
                            where: {
                                [Op.and]: [
                                    { id: req.params.id },
                                    { PostId: req.post.dataValues.id }
                                ]
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Le dislike pour ce commentaire a bien été retiré' }))
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