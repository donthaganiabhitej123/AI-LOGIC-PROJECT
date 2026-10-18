
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the junction table
    await queryInterface.createTable("user_products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
    });

    // Prevent duplicate user-product relationships
    await queryInterface.addConstraint("user_products", {
      fields: ["userId", "productId"],
      type: "unique",
      name: "user_products_userId_productId_unique",
    });
  },

  async down(queryInterface) {
    // Remove the table when rolling back the migration
    await queryInterface.dropTable("user_products");
  },
};
