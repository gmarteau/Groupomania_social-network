'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10).then(async (password) => {
      await queryInterface.bulkInsert('users', [{
        username: 'groupo-admin',
        password: password,
        email: 'groupo@admin.fr',
        firstName: 'Groupo',
        lastName: 'Admin',
        profilePicture: 'http://localhost:3000/images/logo-vertical.png',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
        }], {});    
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
