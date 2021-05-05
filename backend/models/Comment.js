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