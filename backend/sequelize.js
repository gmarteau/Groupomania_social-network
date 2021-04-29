const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('groupomania', process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql'
});

async function testConnectionToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// testConnectionToDatabase();
// sequelize.close();