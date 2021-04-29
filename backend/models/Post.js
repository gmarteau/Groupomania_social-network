const Topic = require("./Topic");
const User = require("./User");

module.exports = (sequelize, type) => {
    return sequelize.define('Post', {
        id: {
            type: type.INTEGER.UNSIGNED,
            autoIncrement: true,
            unique: true
        },
        topic_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Topic,
                key: 'id'
            }
        },
        user_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        date_publication: {
            type: type.DATE,
            defaultValue: type.NOW
        },
        content: {
            type: type.TEXT,
            allowNull: false
        },
        likes: {
            type: type.INTEGER.UNSIGNED
        },
        dislikes: {
            type: type.INTEGER.UNSIGNED
        },
        has_liked: {
            type: type.TEXT
        },
        has_disliked: {
            type: type.TEXT
        },
        number_of_comments: {
            type: type.INTEGER.UNSIGNED
        }
    }, {
        indexes: [
            {
                name: 'primary_topicId_id',
                primaryKey: true,
                fields: ['topic_id', 'id']
            },
            {
                name: 'ind_likes_comments',
                fields: ['likes', 'number_of_comments']
            },
            {
                name: 'ind_post_datePublication',
                fields: ['date_publication']
            }
        ]
    });
};