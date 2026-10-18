"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    useCreateProductMutation,
} from "../features/products/productApi";

export default function ProductRTKQuery() {
  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [
    createProduct,
    {
      isLoading,
      isError,
      isSuccess,
    },
  ] = useCreateProductMutation();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim() || !price) {
      return;
    }

    try {
      await createProduct({
        name: name.trim(),
        price: Number(price),
      }).unwrap();

      setName("");
      setPrice("");
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );
    }
  };

  return (
    <div>
      <h2>
        RTK Query
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Product Name
          </label>

          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div>
          <label>
            Product Price
          </label>

          <input
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating..."
            : "Create Product"}
        </button>
      </form>

      {isSuccess && (
        <p>
          Product created successfully
        </p>
      )}

      {isError && (
        <p>
          Failed to create product
        </p>
      )}
    </div>
  );
}