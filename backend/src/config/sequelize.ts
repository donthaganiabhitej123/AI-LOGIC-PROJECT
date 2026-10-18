
import "dotenv/config";
import "reflect-metadata";

import { Sequelize } from "sequelize-typescript";

import Product from "../models/Product";
import User from "../models/User";
import UserProduct from "../models/UserProduct";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  models: [User, Product, UserProduct],
});

export default sequelize;
