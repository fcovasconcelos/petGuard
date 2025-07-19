'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('localizacoes', {
      localizacao_id: {
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
      latitude: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false,
      },
      precisao: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      data_hora: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Data e hora atual
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
    await queryInterface.dropTable('localizacoes');
  },
};
