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
                    description: req.body.description
                })
                    .then(() => res.status(201).json({ message: 'Topic créé' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getTopicsNamesList = (req, res, next) => {
    if (req.query.name) {
        Topic.findAll({
            attributes: ['name'],
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
    } else {
        Topic.findAll({
            attributes: ['name'],
            order: [
                ['name', 'ASC']
            ]
        })
            .then(topics => res.status(200).json(topics))
            .catch(error => res.status(400).json({ error }));    
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