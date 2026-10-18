"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import { debounce } from "../lib/debounce";

import {
  createProduct,
  getProducts,
  Product,
  searchProducts,
} from "../lib/productApi";

export default function ProductApi() {
  // ==========================================
  // CREATE PRODUCT STATES
  // ==========================================

  const [name, setName] = useState("");

  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // ==========================================
  // GET PRODUCTS STATE
  // ==========================================

  const [products, setProducts] =
    useState<Product[]>([]);

  // ==========================================
  // SEARCH PRODUCT STATES
  // ==========================================

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] =
    useState<Product[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");

    if (!name.trim() || !price) {
      setMessage(
        "Name and price are required"
      );

      return;
    }

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setMessage(
        "Price must be a valid number"
      );

      return;
    }

    try {
      setLoading(true);

      const product =
        await createProduct(
          name.trim(),
          numericPrice
        );

      setMessage(
        `Product created successfully: ${product.name}`
      );

      setName("");
      setPrice("");
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setMessage(
        "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setMessage("");

      const data =
        await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(
        "Get products error:",
        error
      );

      setMessage(
        "Failed to fetch products"
      );
    }
  };

  // ==========================================
  // SELECT PRODUCT FROM DROPDOWN
  // ==========================================

  const handleSelectProduct = (
    product: Product
  ) => {
    setName(product.name);

    setPrice(
      String(product.price)
    );

    setSearch("");

    setSearchResults([]);

    setSearchLoading(false);
  };

  // ==========================================
  // DEBOUNCED SEARCH
  // ==========================================

  const debouncedSearch = useMemo(() => {
    let latestRequestId = 0;

    return debounce(
      async (searchTerm: string) => {
        const trimmedSearch =
          searchTerm.trim();

        const requestId =
          ++latestRequestId;

        // Empty search
        if (!trimmedSearch) {
          setSearchResults([]);
          setSearchLoading(false);

          return;
        }

        try {
          const data =
            await searchProducts(
              trimmedSearch
            );

          // Ignore old response
          if (
            requestId !==
            latestRequestId
          ) {
            return;
          }

          setSearchResults(data);
        } catch (error) {
          // Ignore old request error
          if (
            requestId !==
            latestRequestId
          ) {
            return;
          }

          console.error(
            "Search products error:",
            error
          );

          setSearchResults([]);

          setMessage(
            "Failed to search products"
          );
        } finally {
          if (
            requestId ===
            latestRequestId
          ) {
            setSearchLoading(false);
          }
        }
      },
      500
    );
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      {/* ======================================
          CREATE PRODUCT
      ====================================== */}

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
              setName(
                event.target.value
              )
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
              setPrice(
                event.target.value
              )
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Product"}
        </button>
      </form>

      {/* ======================================
          MESSAGE
      ====================================== */}

      {message && (
        <p>{message}</p>
      )}

      {/* ======================================
          SEARCH PRODUCTS
      ====================================== */}

      <div className="product-search">
        <label>
          Search Product
        </label>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => {
              const value =
                event.target.value;

              setSearch(value);

              if (!value.trim()) {
                setSearchResults([]);
                setSearchLoading(false);

                return;
              }

              setSearchLoading(true);

              debouncedSearch(value);
            }}
          />

          {/* SEARCHING */}

          {searchLoading && (
            <div className="search-dropdown">
              <p className="no-results">
                Searching...
              </p>
            </div>
          )}

          {/* SEARCH RESULTS */}

          {!searchLoading &&
            searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map(
                  (product) => (
                    <button
                      type="button"
                      key={product.id}
                      className="search-item"
                      onClick={() =>
                        handleSelectProduct(
                          product
                        )
                      }
                    >
                      <span>
                        {product.name}
                      </span>

                      <span>
                        ₹{product.price}
                      </span>
                    </button>
                  )
                )}
              </div>
            )}

          {/* NO RESULTS */}

          {!searchLoading &&
            search.trim() &&
            searchResults.length === 0 && (
              <div className="search-dropdown">
                <p className="no-results">
                  No products found
                </p>
              </div>
            )}
        </div>
      </div>

      {/* ======================================
          GET PRODUCTS
      ====================================== */}

      <div>
        <button
          type="button"
          onClick={loadProducts}
        >
          Get Products
        </button>
      </div>

      {/* ======================================
          PRODUCT LIST
      ====================================== */}

      <div>
        {products.map(
          (product) => (
            <div
              key={product.id}
            >
              <p>
                Name:{" "}
                {product.name}
              </p>

              <p>
                Price: ₹
                {product.price}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}