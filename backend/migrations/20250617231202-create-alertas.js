'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alertas', {
      alerta_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      pet_id: {
        type: Sequelize.UUID,
        references: {
          model: 'pets',
          key: 'pet_id',
        },
        onDelete: 'CASCADE',
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      data_hora: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Data e hora do alerta
      },
      resolvido: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Indica se o alerta foi resolvido
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alertas');
  },
};
// migrations/[timestamp]-create-alertas.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alertas', {
      alerta_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      pet_id: {
        type: Sequelize.UUID,
        references: {
          model: 'pets',
          key: 'pet_id',
        },
        onDelete: 'CASCADE',
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      data_hora: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Data e hora do alerta
      },
      resolvido: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Indica se o alerta foi resolvido
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alertas');
  },
};
