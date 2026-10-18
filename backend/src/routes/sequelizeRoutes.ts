import { Router } from "express";

import {
    assignProductController,
    createProductController,
    createUserController,
    getProductsController,
} from "../controllers/sequelizeController";

const router = Router();

router.post("/users", createUserController);

router.post("/products", createProductController);

router.get("/products", getProductsController);

router.post(
  "/user-products",
  assignProductController
);

export default router;