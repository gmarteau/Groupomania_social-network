const User = require('../sequelize').User;

module.exports = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (user) {
                return res.status(400).json({ message: 'Username déjà existant' });
            } else {
                next();
            }
        })
        .catch(error => res.status(500).json({ error }));
};

module.exports = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                return res.status(400).json({ message: 'Un compte est déjà associé à cet email' });
            } else {
                next();
            }
        })
        .catch(error => res.status(500).json({ error }));
};