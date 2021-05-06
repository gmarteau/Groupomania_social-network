module.exports = (sequelize, type) => {
    return sequelize.define('Topic', {
        id: {
            type: type.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: type.STRING,
            allowNull: false
        },
        imageUrl: {
            type: type.STRING,
            allowNull: false
        },
        dateCreation: {
            type: type.DATE,
            allowNull: false,
            defaultValue: type.fn('NOW')
        },
        numberOfFollowers: {
            type: type.INTEGER.UNSIGNED,
            defaultValue: 0
        },
        hasFollowed: {
            type: type.TEXT,
            defaultValue: '0'
        }
    }, {
        indexes: [
            {
                name: 'ind_topic_name',
                fields: ['name']
            }, {
                name: 'ind_topic_dateCreation',
                fields: ['dateCreation']
            }, {
                name: 'ind_topic_numberOfFollowers',
                fields: ['numberOfFollowers']
            }
        ],
        timestamps: true
    });
};