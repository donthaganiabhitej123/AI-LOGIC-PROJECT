
import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "../features/userDetailsSlice";

import authReducer from "../features/authSlice";
import { productApi } from "../features/products/productApi";

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    userDetails: userDetailsReducer,
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
