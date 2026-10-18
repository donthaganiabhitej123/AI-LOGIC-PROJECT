import { Router } from "express";

import {
  createNewProduct,
  getAllProducts,
  searchAllProducts
} from "../controllers/productController";

const router = Router();

router.post(
  "/",
  createNewProduct
);

router.get(
  "/",
  getAllProducts
);
//search
router.get(
  "/search",
  searchAllProducts
)

export default router;