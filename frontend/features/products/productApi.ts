import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

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

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createProduct: builder.mutation<
      ProductResponse,
      {
        name: string;
        price: number;
      }
    >({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
} = productApi;