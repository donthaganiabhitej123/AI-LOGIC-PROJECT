import axios from "axios";

const sequelizeApi = axios.create({
  baseURL: "http://localhost:5000/api/sequelize",
  withCredentials: true,
});

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface UserProduct {
  id: number;
  userId: number;
  productId: number;
}

interface UserResponse {
  success: boolean;
  message: string;
  user: User;
}

interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

interface UserProductResponse {
  success: boolean;
  message: string;
  userProduct: UserProduct;
}

export const createUser = async (
  name: string,
  email: string
): Promise<User> => {
  const response =
    await sequelizeApi.post<UserResponse>(
      "/users",
      {
        name,
        email,
      }
    );

  return response.data.user;
};

export const createProduct = async (
  name: string,
  price: number
): Promise<Product> => {
  const response =
    await sequelizeApi.post<ProductResponse>(
      "/products",
      {
        name,
        price,
      }
    );

  return response.data.product;
};

export const getProducts = async (): Promise<
  Product[]
> => {
  const response =
    await sequelizeApi.get<ProductsResponse>(
      "/products"
    );

  return response.data.products;
};

export const assignProductToUser = async (
  userId: number,
  productId: number
): Promise<UserProduct> => {
  const response =
    await sequelizeApi.post<UserProductResponse>(
      "/user-products",
      {
        userId,
        productId,
      }
    );

  return response.data.userProduct;
};
