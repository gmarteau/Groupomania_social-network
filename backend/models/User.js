module.exports = (sequelize, type) => {
    return sequelize.define('User', {
        id: {
            type: type.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        email: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        first_name: {
            type: type.STRING,
            allowNull: false
        },
        last_name: {
            type: type.STRING,
            allowNull: false
        },
        bio: {
            type: type.STRING,
        },
        profile_picture: {
            type: type.STRING,
        }
    }, {
        indexes: [
            {
                name: 'ind_firstName_lastName',
                fields: ['first_name', 'last_name']
            }
        ]
    });
};