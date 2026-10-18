import { Request, Response } from "express";

import {
  createProduct,
  getProducts,
  searchProducts
} from "../services/productService";

import redisClient from "../config/redis";

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createNewProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      res.status(400).json({
        success: false,
        message: "Name and price are required",
      });

      return;
    }

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });

      return;
    }

    const product = await createProduct(
      name.trim(),
      numericPrice
    );

    // Clear cached products after creating a new product
    await redisClient.del("products:all");

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

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getAllProducts = async (
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
//search Products 
 export const searchAllProducts = async (
  req:Request,
  res:Response

 ): Promise <void> =>{
  try{
    const search = typeof req.query.search === "string"?req.query.search.trim():"";
    if(!search) {
      res.status(400).json({
        sucess:false,
        message:"Search term is required",
      });
      return;
    }
    const products = await searchProducts(search);
    res.status(200).json({
      sucess:true,
      products,
    });
  }catch (error){
    console.error(
      "Search products error:",error
    );
    res.status(500).json({
      sucess:false,
      meassage:"Failed to search products"
    })
  }
};