const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../sequelize').User;

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.create({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            })
                .then(() => res.status(200).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({
        where: {
            [Op.or]: [{ username: req.body.username }, { email: req.body.username }]
        }
    })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur inexistant' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.id },
                            process.env.TOKEN_KEY,
                            { expiresIn: '6h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getUserProfile = (req, res, next) => {
    User.findOne({
        attributes: [['id', 'user_id'], 'username', 'first_name', 'last_name', 'bio', 'profile_picture'],
        where: {
            id: req.params.id
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'Aucun utilisateur ne correspond à cet identifiant' });
            }
            res.status(200).json(user);
        })
        .catch(error => res.status(500).json({ error }));
};

exports.updateUserProfile = (req, res, next) => {
    
};