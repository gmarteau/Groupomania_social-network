const User = require("./User");

module.exports = (sequelize, type) => {
    return sequelize.define('Topic', {
        id: {
            type: type.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        name: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: type.STRING,
            allowNull: false
        }
    }, {
        indexes: [
            {
                name: 'ind_topic_name',
                fields: ['name']
            }
        ]
    });
};