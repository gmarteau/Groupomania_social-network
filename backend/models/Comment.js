module.exports = (sequelize, type) => {
    return sequelize.define('Comment', {
        id: {
            type: type.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: {
                    tableName: 'posts'
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
        }
    }, {
        indexes: [
            {
                name: 'ind_postId_id',
                fields: ['post_id', 'id']
            },
            {
                name: 'ind_comment_datePublication',
                fields: ['date_publication']
            }
        ],
        timestamps: true
    });
};