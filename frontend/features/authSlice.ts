
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    clearAuthentication(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearAuthentication } =
  authSlice.actions;

export default authSlice.reducer;
