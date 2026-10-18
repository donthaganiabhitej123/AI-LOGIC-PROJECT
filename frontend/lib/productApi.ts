import axios from "axios";

export interface Product {
  id: number;
  name: string;
  price: number;
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

const productApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const createProduct = async (
  name: string,
  price: number
): Promise<Product> => {
  const response =
    await productApi.post<ProductResponse>(
      "/products",
      {
        name,
        price,
      }
    );

  return response.data.product;
};

export const getProducts = async (): Promise<Product[]> => {
  const response =
    await productApi.get<ProductsResponse>(
      "/products"
    );

  return response.data.products;
};
//search 

export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  const response =
    await productApi.get<ProductsResponse>(
      "/products/search",
      {
        params: {
          search: searchTerm,
        },
      }
    );

  return response.data.products;
};
