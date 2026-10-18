
"use strict";

module.exports = {
  // Insert sample products
  async up(queryInterface) {
    await queryInterface.bulkInsert("products", [
      {
        name: "SEEDER_DEMO_LAPTOP_001",
        price: "50000.00",
      },
      {
        name: "SEEDER_DEMO_MOUSE_001",
        price: "800.00",
      },
      {
        name: "SEEDER_DEMO_KEYBOARD_001",
        price: "1500.00",
      },
    ]);
  },

  // Remove only the products inserted by this seeder
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "products",
      {
        name: {
          [Sequelize.Op.in]: [
            "SEEDER_DEMO_LAPTOP_001",
            "SEEDER_DEMO_MOUSE_001",
            "SEEDER_DEMO_KEYBOARD_001",
          ],
        },
      },
      {}
    );
  },
};
