import redisClient from "../config/redis";
import pool from "../db/database";

export interface Product {
  id: number;
  name: string;
  price: number;
}

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = async (
  name: string,
  price: number
): Promise<Product> => {
  const result = await pool.query<Product>(
    `
    INSERT INTO products
      (name, price)
    VALUES
      ($1, $2)
    RETURNING
      id,
      name,
      price
    `,
    [name, price]
  );

  return result.rows[0];
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async (search ?: string): Promise<Product[]> => {
  const searchTerm =search?.trim().toLowerCase();
  const cacheKey = "products:all";

  // 1. Check Redis first
  const cachedProducts =
    await redisClient.get(cacheKey);

  if (cachedProducts) {
    console.log("Products fetched from Redis");

    return JSON.parse(cachedProducts) as Product[];
  }

  // 2. Redis cache miss → get from PostgreSQL
  console.log(
    "Products not found in Redis. Fetching from PostgreSQL..."
  );

  const result = await pool.query<Product>(
    `
    SELECT
      id,
      name,
      price
    FROM products
    ORDER BY id DESC
    `
  );

  // 3. Store PostgreSQL result in Redis
  await redisClient.setEx(
    cacheKey,
    60,
    JSON.stringify(result.rows)
  );

  console.log(
    "Products fetched from PostgreSQL and cached in Redis"
  );

  // 4. Return products
  return result.rows;
};

// ==========================================
// SEARCH PRODUCTS
// ==========================================

export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  const result = await pool.query<Product>(
    `
    SELECT
      id,
      name,
      price
    FROM products
    WHERE LOWER(name) LIKE $1
    ORDER BY id DESC
    `,
    [`%${searchTerm.trim().toLowerCase()}%`]
  );

  return result.rows;
};