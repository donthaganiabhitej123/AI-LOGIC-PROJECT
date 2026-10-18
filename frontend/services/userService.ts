
import type { AuthUser } from "../features/authSlice";
import api from "../lib/api";

interface CurrentUserResponse {
  success: boolean;
  user: AuthUser;
  message?: string;
}

export const userService = {
  async getMyDetails(): Promise<AuthUser> {
    const response = await api.get<CurrentUserResponse>(
      "/users/me"
    );

    if (!response.data.success || !response.data.user) {
      throw new Error(
        response.data.message || "Invalid user response"
      );
    }

    return response.data.user;
  },
};
