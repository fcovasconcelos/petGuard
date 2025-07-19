'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('atividade_fisica', {
      atividade_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Gera UUID automaticamente
      },
      pet_id: {
        type: Sequelize.UUID,
        references: {
          model: 'pets', // Referência à tabela de pets
          key: 'pet_id',
        },
        onDelete: 'CASCADE', // Se o pet for excluído, a atividade também é excluída
      },
      data_hora_inicio: {
        type: Sequelize.DATE,
        allowNull: false, // A data e hora de início é obrigatória
      },
      data_hora_fim: {
        type: Sequelize.DATE,
        allowNull: true, // A data e hora de fim pode ser opcional
      },
      nivel_atividade: {
        type: Sequelize.STRING,
        allowNull: false, // O nível de atividade é obrigatório
      },
      duracao_segundos: {
        type: Sequelize.INTEGER,
        allowNull: false, // A duração deve ser informada em segundos
      },
      passos_estimados: {
        type: Sequelize.INTEGER,
        allowNull: true, // Passos estimados são opcionais
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
    await queryInterface.dropTable('atividade_fisica');
  },
};
