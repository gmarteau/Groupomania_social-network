const { Op } = require('sequelize');
const seq = require('../sequelize');
const Topic = seq.topic;
const User = seq.user;

exports.createTopic = (req, res, next) => {
    Topic.findOne({
        where: {
            name: req.body.name
        }
    })
        .then(topic => {
            if (topic) {
                return res.status(400).json({ error: 'Un topic porte déjà ce nom' });
            } else {
                Topic.create({
                    UserId: req.body.userId,
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl
                })
                    .then(() => res.status(201).json({ message: 'Topic créé' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getTopics = (req, res, next) => {
    if (req.query.name) {
        Topic.findAll({
            where: {
                name: {
                    [Op.substring]: req.query.name
                }
            }
        })
            .then(topics => res.status(200).json(topics))
            .catch(error => {
                console.log(error);
                res.status(400).json({ error });});
    }
    if (req.query.order == 'recent') {
        if (req.query.limit) {
            Topic.findAll({
                limit: parseInt(req.query.limit),
                order: [
                    ['dateCreation', 'DESC']
                ]
            })
                .then(topics => res.status(200).json(topics))
                .catch(error => res.status(400).json({ error }));        
        } else {
            Topic.findAll({
                order: [
                    ['dateCreation', 'DESC']
                ]
            })
                .then(topics => res.status(200).json(topics))
                .catch(error => res.status(400).json({ error }));        
        }
    } else if (req.query.order == 'popular') {
        if (req.query.limit) {
            Topic.findAll({
                limit: parseInt(req.query.limit),
                order: [
                    ['numberOfFollowers', 'DESC']
                ]
            })
                .then(topics => res.status(200).json(topics))
                .catch(error => res.status(400).json({ error }));        
        } else {
            Topic.findAll({
                order: [
                    ['numberOfFollowers', 'DESC']
                ]
            })
                .then(topics => res.status(200).json(topics))
                .catch(error => res.status(400).json({ error }));        
        }
    } else if (req.query.order == 'followed') {
        const userId = req.query.userId.toString();
        if (req.query.limit) {
            Topic.findAll({
                limit: parseInt(req.query.limit),
                where: {
                    [Op.or]: [
                        {
                            hasFollowed: {
                                [Op.substring]: `,${userId},`
                            }        
                        }, {
                            hasFollowed: {
                                [Op.endsWith]: `,${userId}`
                            }
                        }
                    ]
                },
                order: [
                    ['name', 'ASC']
                ]
            })
                .then(topics => res.status(200).json(topics))
                .catch(error => res.status(400).json({ error }));    
        } else {
            Topic.findAll({
                where: {
                    [Op.or]: [
                        {
                            hasFollowed: {
                                [Op.substring]: `,${userId},`
                            }        
                        }, {
                            hasFollowed: {
                                [Op.endsWith]: `,${userId}`
                            }
                        }
                    ]
                },
                order: [
                    ['name', 'ASC']
                ]
            })
                .then(topics => res.status(200).json(topics))
                .catch(error => res.status(400).json({ error }));    
        }
    }
};

exports.getTopicById = (req, res, next) => {
    Topic.findOne({
        include: {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'profilePicture']
        },
        where: {
            id: req.params.id
        }
    })
        .then(topic => res.status(200).json(topic))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteTopic = (req, res, next) => {
    Topic.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(topic => {
            if (topic.dataValues.UserId !== req.body.userId) {
                return res.status(401).json({ error: 'Vous n\'avez pas les droits nécessaires à la suppression de ce topic' });
            } else {
                Topic.destroy({
                    where:{
                        id: req.params.id
                    }
                })
                    .then(() => res.status(200).json({ message: 'Topic supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.followTopic = (req, res, next) => {
    Topic.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(topic => {
            const userId = req.body.userId.toString();
            const hasFollowed = Array.from(topic.dataValues.hasFollowed);
            const hasFollowedFiltered = hasFollowed.filter(char => char !== ',');
            const alreadyFollowed = hasFollowedFiltered.includes(userId);
            switch (req.body.follow) {
                case 1:
                    if (alreadyFollowed) {
                        return res.status(401).json({ error: 'L\'utilisateur suit déjà ce topic' });
                    } else {
                        hasFollowedFiltered.push(userId);
                        topic.dataValues.numberOfFollowers++;
                        Topic.update({
                            hasFollowed: hasFollowedFiltered.toString(),
                            numberOfFollowers: topic.dataValues.numberOfFollowers
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Topic suivi' }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;
                case 0:
                    if (!alreadyFollowed) {
                        return res.status(401).json({ error: 'L\'utilisateur ne peut pas unfollow un topic qu\'il ne follow pas' });
                    } else {
                        const index = hasFollowedFiltered.indexOf(userId);
                        hasFollowedFiltered.splice(index, 1);
                        topic.dataValues.numberOfFollowers--;
                        Topic.update({
                            hasFollowed: hasFollowedFiltered.toString(),
                            numberOfFollowers: topic.dataValues.numberOfFollowers
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Le topic n\'est plus suivi' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                default:
                    return res.status(400).json({ error: 'follow ne peut avoir une autre valeur que 0 ou 1' });
            }
        })
        .catch(error => res.status(400).json({ error }));
};