
"use strict";

module.exports = {
  // Apply the database change
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "description", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  // Reverse the database change
  async down(queryInterface) {
    await queryInterface.removeColumn(
      "products",
      "description"
    );
  },
};
