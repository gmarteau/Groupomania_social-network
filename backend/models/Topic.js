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
        }
    }, {
        indexes: [
            {
                name: 'ind_topic_name',
                fields: ['name']
            }
        ],
        timestamps: true
    });
};