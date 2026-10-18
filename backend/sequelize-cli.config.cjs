
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    migrationStorage: "sequelize",
    migrationStorageTableName: "SequelizeMeta",
     seederStorage: "sequelize",
    seederStorageTableName: "SequelizeData",
  },
};
