module.exports = (sequelize, type) => {
    return sequelize.define('Post', {
        id: {
            type: type.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        topic_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: {
                    tableName: 'topics'
                },
                key: 'id'
            }
        },
        author_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: {
                    tableName: 'users'
                },
                key: 'id'
            }
        },
        date_publication: {
            type: type.DATE,
            allowNull: false,
            defaultValue: type.fn('NOW')
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
                name: 'ind_topicId_id',
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