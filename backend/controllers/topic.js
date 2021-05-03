const seq = require('../sequelize');
const Topic = seq.topic;

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
                    author_id: req.body.author_id,
                    name: req.body.name,
                    description: req.body.description
                })
                    .then(() => res.status(201).json({ message: 'Topic créé' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};