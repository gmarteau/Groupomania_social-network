const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();
const { Op } = require('sequelize');
const seq = require('../sequelize');
const User = seq.user;

const defaultAvatarUrl = (req) => {
    return `${req.protocol}://${req.get('host')}/images/default_avatar.png`;
};


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const defaultAvatar = defaultAvatarUrl(req);
            User.create({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                bio: req.body.bio,
                profilePicture: defaultAvatar
            })
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
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
            console.log(process.env.TOKEN_KEY);
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur inexistant' });
            }
            bcrypt.compare(req.body.password, user.dataValues.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.dataValues.id },
                            process.env.TOKEN_KEY,
                            { expiresIn: '6h' }
                        )
                    });
                })
                .catch(error => res.status(400).json({ error }));
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
    if (req.file) {
        User.findOne({
            where: {
                id: req.body.user.user_id
            }
        })
            .then(user => {
                if (user.profile_picture !== defaultAvatarUrl(req)) {
                    const filename = user.profile_picture.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        User.update({
                            firstName: req.body.user.firstName,
                            lastName: req.body.user.lastName,
                            bio: req.body.user.bio,
                            profilePicture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        }, {
                            where: {
                                id: req.body.user.userId
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Informations mises à jour' }))
                            .catch(error => res.status(400).json({ error }));
                    });
                } else {
                    User.update({
                        firstName: req.body.user.firstName,
                        lastName: req.body.user.lastName,
                        bio: req.body.user.bio,
                        profilePicture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }, {
                        where: {
                            id: req.body.user.userId
                        }
                    })
                        .then(() => res.status(200).json({ message: 'Informations mises à jour' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        User.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bio: req.body.bio
        }, {
            where: {
                id: req.body.userId
            }
        })
        .then(() => res.status(200).json({ message: 'Informations mises à jour' }))
        .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteUser = (req, res, next) => {
    User.findOne({
        where: {
            id: req.body.userId
        }
    })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe erroné' });
                    }
                    const defaultAvatar = defaultAvatarUrl(req);
                    if (user.profilePicture !== defaultAvatar) {
                        const filename = user.profilePicture.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                            User.destroy({
                                where: {
                                    id: req.params.id
                                }
                            })
                                .then(() => res.status(200).json({ message: 'Utilisateur supprimé' }))
                                .catch(error => res.status(400).json({ error }));
                        });
                    } else {
                        User.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Utilisateur supprimé' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
        })
        .catch(error => res.status(500).json({ error }));
};