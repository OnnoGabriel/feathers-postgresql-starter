/* eslint-disable no-console */

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => { // eslint-disable-line no-unused-vars

    /**
     * Users table
     */
    const users = [];
    const defaultPassword  = bcrypt.hashSync('secret', 12);

    users.push({
      id: 1,
      email: 'jon@example.com',
      firstName: 'Jon',
      lastName: 'Doe',
      password: defaultPassword,
      createdAt: new Date(),
      updatedAt:new Date()
    });
    users.push({
      id: 2,
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: defaultPassword,
      createdAt: new Date(),
      updatedAt:new Date()
    });

    await queryInterface.bulkInsert('users', users, {});
    console.log('Users created.');

  },

  down: async (queryInterface, Sequelize) => { // eslint-disable-line no-unused-vars
    return await queryInterface.bulkDelete('users', null, {});
  }
};
