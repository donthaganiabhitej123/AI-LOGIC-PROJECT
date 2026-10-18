"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_roles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // ID of the account from your users1 login table
      authUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },

      // New accounts are normal users by default
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "user",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Only allow admin or user roles
    await queryInterface.addConstraint("user_roles", {
      fields: ["role"],
      type: "check",
      where: {
        role: {
          [Sequelize.Op.in]: ["admin", "user"],
        },
      },
      name: "user_roles_role_check",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_roles");
  },
};