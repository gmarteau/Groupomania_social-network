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
        firstName: {
            type: type.STRING,
            allowNull: false
        },
        lastName: {
            type: type.STRING,
            allowNull: false
        },
        bio: {
            type: type.STRING,
        },
        profilePicture: {
            type: type.STRING,
        },
        isAdmin: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            {
                name: 'ind_username',
                fields: ['username']
            },
            {
                name: 'ind_email',
                fields: ['email']
            }
        ],
        timestamps: true
    });
};