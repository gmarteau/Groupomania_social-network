module.exports = (sequelize, type) => {
    return sequelize.define('Post', {
        id: {
            type: type.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        datePublication: {
            type: type.DATE,
            allowNull: false,
            defaultValue: type.fn('NOW')
        },
        content: {
            type: type.TEXT,
            allowNull: false
        },
        likes: {
            type: type.INTEGER.UNSIGNED,
            defaultValue: 0
        },
        dislikes: {
            type: type.INTEGER.UNSIGNED,
            defaultValue: 0
        },
        hasLiked: {
            type: type.TEXT,
            defaultValue: '0'
        },
        hasDisliked: {
            type: type.TEXT,
            defaultValue: '0'
        },
        numberOfComments: {
            type: type.INTEGER.UNSIGNED,
            defaultValue: 0
        }
    }, {
        indexes: [
            {
                name: 'ind_likes_comments',
                fields: ['likes', 'numberOfComments']
            },
            {
                name: 'ind_post_datePublication',
                fields: ['datePublication']
            }
        ],
        timestamps: true
    });
};