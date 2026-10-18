
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { userService } from "../services/userService";
import type { AuthUser } from "./authSlice";

export const fetchMyDetails = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>(
  "userDetails/fetchMyDetails",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await userService.getMyDetails();
    } catch (err: unknown) {
      if (signal.aborted) {
        throw err;
      }

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        return rejectWithValue(
          status === 401
            ? "Your session has expired. Please log in again."
            : status === 403
              ? "You are not authorized to access these details."
              : typeof message === "string"
                ? message
                : "Unable to load your details."
        );
      }

      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Unable to load your details."
      );
    }
  }
);
