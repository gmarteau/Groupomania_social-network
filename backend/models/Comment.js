module.exports = (sequelize, type) => {
    return sequelize.define('Comment', {
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
            type: type.INTEGER.UNSIGNED
        },
        dislikes: {
            type: type.INTEGER.UNSIGNED
        },
        hasLiked: {
            type: type.TEXT
        },
        hasDisliked: {
            type: type.TEXT
        }
    }, {
        indexes: [
            {
                name: 'ind_comment_datePublication',
                fields: ['datePublication']
            }
        ],
        timestamps: true
    });
};