import { Request, Response } from "express";

import {
    assignProductToUser,
    createProduct,
    createUser,
    getProducts,
} from "../services/sequelizeServices";

export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body;

    const user = await createUser(name, email);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export const createProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price } = req.body;

    const product = await createProduct(
      name,
      Number(price)
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const getProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await getProducts();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const assignProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    const userProduct =
      await assignProductToUser(
        Number(userId),
        Number(productId)
      );

    res.status(201).json({
      success: true,
      message: "Product assigned to user",
      userProduct,
    });
  } catch (error) {
    console.error(
      "Assign product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to assign product",
    });
  }
};