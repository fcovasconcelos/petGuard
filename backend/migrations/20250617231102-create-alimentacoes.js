'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alimentacoes', {
      alimentacao_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pets',
          key: 'pet_id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      data_hora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')  //define valor padrão
      },
      quantidade_g: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      tipo_refeicao: {
        type: Sequelize.ENUM('cafe_da_manha', 'almoco', 'jantar', 'extra'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alimentacoes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_alimentacoes_tipo_refeicao";');
  }
};
