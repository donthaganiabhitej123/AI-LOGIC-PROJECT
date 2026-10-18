"use client";

import { useState } from "react";

import {
  useAssignProductToUser,
  useCreateProduct,
  useCreateUser,
  useProducts,
} from "../hooks/useSequelize";

export default function SequelizeData() {
  // -----------------------------
  // User state
  // -----------------------------

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // -----------------------------
  // Product state
  // -----------------------------

  const [productName, setProductName] =
    useState("");

  const [productPrice, setProductPrice] =
    useState("");

  // -----------------------------
  // User-Product state
  // -----------------------------

  const [userId, setUserId] = useState("");
  const [productId, setProductId] =
    useState("");

  // -----------------------------
  // TanStack Query mutations
  // -----------------------------

  const createUserMutation =
    useCreateUser();

  const createProductMutation =
    useCreateProduct();

  const assignProductMutation =
    useAssignProductToUser();

  // -----------------------------
  // Get products
  // -----------------------------

  const {
    data: products,
    isLoading,
    isError,
  } = useProducts();

  // -----------------------------
  // Create User
  // -----------------------------

  const handleCreateUser = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim()
    ) {
      return;
    }

    createUserMutation.mutate({
      name: name.trim(),
      email: email.trim(),
    });
  };

  // -----------------------------
  // Create Product
  // -----------------------------

  const handleCreateProduct = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !productName.trim() ||
      !productPrice.trim()
    ) {
      return;
    }

    const price = Number(productPrice);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return;
    }

    createProductMutation.mutate({
      name: productName.trim(),
      price,
    });
  };

  // -----------------------------
  // Assign Product to User
  // -----------------------------

  const handleAssignProduct = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !userId.trim() ||
      !productId.trim()
    ) {
      return;
    }

    const numericUserId = Number(userId);
    const numericProductId =
      Number(productId);

    if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      return;
    }

    if (
      !Number.isInteger(numericProductId) ||
      numericProductId <= 0
    ) {
      return;
    }

    assignProductMutation.mutate({
      userId: numericUserId,
      productId: numericProductId,
    });
  };

  return (
    <div>
      {/* =================================
          CREATE USER
      ================================= */}

      <section>
        <h2>Create User</h2>

        <form onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter user name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={
              createUserMutation.isPending
            }
          >
            {createUserMutation.isPending
              ? "Creating..."
              : "Create User"}
          </button>
        </form>

        {createUserMutation.isSuccess && (
          <p>
            User created successfully
          </p>
        )}

        {createUserMutation.isError && (
          <p>
            Failed to create user
          </p>
        )}
      </section>

      {/* =================================
          CREATE PRODUCT
      ================================= */}

      <section>
        <h2>Create Product</h2>

        <form
          onSubmit={handleCreateProduct}
        >
          <div>
            <label htmlFor="productName">
              Product Name
            </label>

            <input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(event) =>
                setProductName(
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label htmlFor="productPrice">
              Product Price
            </label>

            <input
              id="productPrice"
              type="number"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(event) =>
                setProductPrice(
                  event.target.value
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={
              createProductMutation.isPending
            }
          >
            {createProductMutation.isPending
              ? "Creating..."
              : "Create Product"}
          </button>
        </form>

        {createProductMutation.isSuccess && (
          <p>
            Product created successfully
          </p>
        )}

        {createProductMutation.isError && (
          <p>
            Failed to create product
          </p>
        )}
      </section>

      {/* =================================
          ASSIGN PRODUCT TO USER
      ================================= */}

      <section>
        <h2>
          Assign Product to User
        </h2>

        <form
          onSubmit={handleAssignProduct}
        >
          <div>
            <label htmlFor="userId">
              User ID
            </label>

            <input
              id="userId"
              type="number"
              placeholder="Enter user ID"
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="productId">
              Product ID
            </label>

            <input
              id="productId"
              type="number"
              placeholder="Enter product ID"
              value={productId}
              onChange={(event) =>
                setProductId(
                  event.target.value
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={
              assignProductMutation.isPending
            }
          >
            {assignProductMutation.isPending
              ? "Assigning..."
              : "Assign Product"}
          </button>
        </form>

        {assignProductMutation.isSuccess && (
          <p>
            Product assigned to user
            successfully
          </p>
        )}

        {assignProductMutation.isError && (
          <p>
            Failed to assign product to
            user
          </p>
        )}
      </section>

      {/* =================================
          PRODUCTS LIST
      ================================= */}

      <section>
        <h2>Products</h2>

        {isLoading && (
          <p>Loading products...</p>
        )}

        {isError && (
          <p>
            Failed to fetch products
          </p>
        )}

        {!isLoading &&
          !isError &&
          products &&
          products.length === 0 && (
            <p>
              No products found
            </p>
          )}

        {!isLoading &&
          !isError &&
          products &&
          products.length > 0 && (
            <div>
              {products.map(
                (product) => (
                  <div
                    key={product.id}
                  >
                    <p>
                      ID: {product.id}
                    </p>

                    <p>
                      Name:{" "}
                      {product.name}
                    </p>

                    <p>
                      Price: ₹
                      {product.price}
                    </p>

                    <hr />
                  </div>
                )
              )}
            </div>
          )}
      </section>
    </div>
  );
}