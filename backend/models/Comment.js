const Post = require("./Post")
const User = require("./User")

module.exports = (sequelize, type) => {
    return sequelize.define('Comment', {
        id: {
            type: type.INTEGER.UNSIGNED,
            autoIncrement: true,
            unique: true
        },
        post_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Post,
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
        }
    }, {
        indexes: [
            {
                name: 'primary_postId_id',
                primaryKey: true,
                fields: ['post_id', 'id']
            },
            {
                name: 'ind_comment_datePublication',
                fields: ['date_publication']
            }
        ]
    });
};