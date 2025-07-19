'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pets', {
      pet_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Gera UUID automaticamente
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      especie: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      raca: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      peso_kg: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
      },
      data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tutor_id: {
        type: Sequelize.UUID,
        references: {
          model: 'tutores', // Referência à tabela tutores
          key: 'tutor_id',
        },
        onDelete: 'CASCADE', // Quando o tutor for excluído, os pets também serão excluídos
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
    await queryInterface.dropTable('pets');
  },
};
