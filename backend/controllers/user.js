const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();
const { Op } = require('sequelize');
const seq = require('../sequelize');
const User = seq.user;
const xss = require('xss');

exports.signup = (req, res, next) => {
    console.log('wwwoooooow');
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(usernameAlreadyExists => {
            console.log('xxxxx');
            if (!usernameAlreadyExists) {
                User.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                    .then(emailAlreadyExists => {
                        console.log('aaaa');
                        if (!emailAlreadyExists) {
                            bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                const defaultAvatar = 'http://localhost:3000/images/default_avatar.png';
                                User.create({
                                    username: xss(req.body.username),
                                    password: hash,
                                    email: xss(req.body.email),
                                    firstName: xss(req.body.firstName),
                                    lastName: xss(req.body.lastName),
                                    bio: xss(req.body.bio),
                                    profilePicture: defaultAvatar
                                })
                                    .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                                    .catch(error => res.status(400).json({ error: 'ciao' }));
                            })
                            .catch(error => res.status(500).json({ error }));                    
                        } else {
                            console.log('erreur');
                            return res.status(401).json({ error002: new Error('Email déjà existant') });
                        }
                    })
                    .catch(error => res.status(400).json({ error: 'hello' }));
            } else {
                return res.status(401).json({ error001: new Error('Username déjà existant') });
            }
        })
        .catch(error => res.status(400).json({ error: 'coucou' }));
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
            bcrypt.compare(req.body.password, user.dataValues.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user.id,
                        isAdmin: user.isAdmin,
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
        attributes: [['id', 'userId'], 'username', 'email', 'firstName', 'lastName', 'bio', 'profilePicture', 'createdAt'],
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
                id: req.params.id
            }
        })
            .then(user => {
                const defaultAvatarUrl = 'http://localhost:3000/images/default_avatar.png';
                if (user.profilePicture !== defaultAvatarUrl) {
                    const filename = user.dataValues.profilePicture.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        User.update({
                            firstName: xss(req.body.firstName),
                            lastName: xss(req.body.lastName),
                            bio: xss(req.body.bio),
                            profilePicture: `http://localhost:3000/images/${req.file.filename}`
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(() => res.status(200).json({ message: 'Informations mises à jour' }))
                            .catch(error => res.status(400).json({ error }));
                    });
                } else {
                    console.log("la");
                    User.update({
                        firstName: xss(req.body.firstName),
                        lastName: xss(req.body.lastName),
                        bio: xss(req.body.bio),
                        profilePicture: `http://localhost:3000/images/${req.file.filename}`
                    }, {
                        where: {
                            id: req.params.id
                        }
                    })
                        .then(() => res.status(200).json({ message: 'Informations mises à jour' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        User.update({
            firstName: xss(req.body.firstName),
            lastName: xss(req.body.lastName),
            bio: xss(req.body.bio)
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({ message: 'Informations mises à jour' }))
        .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteUser = (req, res, next) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe erroné' });
                    }
                    const defaultAvatar = 'http://localhost:3000/images/default_avatar.png';
                    if (user.profilePicture !== defaultAvatar) {
                        const filename = user.dataValues.profilePicture.split('/images/')[1];
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

exports.getUsersByIds = (req, res, next) => {
    const index = req.query.followers.indexOf('0');
    req.query.followers.splice(index, 1);
    if (req.query.limit) {
        User.findAll({
            attributes: ['username', 'firstName', 'lastName'],
            where: {
                id: {
                    [Op.in]: req.query.followers
                }
            },
            limit: parseInt(req.query.limit)
        })
            .then(users => res.status(200).json(users))
            .catch(error => res.status(400).json({ error }));    
    } else {
        User.findAll({
            attributes: ['username', 'firstName', 'lastName'],
            where: {
                id: {
                    [Op.in]: req.query.followers
                }
            }
        })
            .then(users => res.status(200).json(users))
            .catch(error => res.status(400).json({ error }));    
    }
}