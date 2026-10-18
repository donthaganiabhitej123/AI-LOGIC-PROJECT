
import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser } from "./authSlice";
import { fetchMyDetails } from "./userDetailsThunk";

interface UserDetailsState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserDetailsState = {
  user: null,
  loading: false,
  error: null,
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMyDetails.rejected, (state, action) => {
        state.loading = false;

        if (action.meta.aborted) {
          return;
        }

        state.error =
          action.payload ?? "Unable to load your details.";
      });
  },
});

export const { clearUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
