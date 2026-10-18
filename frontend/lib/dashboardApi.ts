import axios from "axios";

// ==========================================
// Interfaces
// ==========================================

export interface Analytics {
  totalUsers: number;
  totalProducts: number;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  analytics?: Analytics;
}

export interface Notification {
  id: number;
  message: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  notifications?: Notification[];
}

// ==========================================
// Axios Instance
// ==========================================

const dashboardApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ==========================================
// Analytics API
// ==========================================

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await dashboardApi.get<AnalyticsResponse>(
      "/dashboard/analytics"
    );

    let isSuccess = false;

    if (
      response.status === 200 &&
      response.data.success &&
      response.data.analytics
    ) {
      isSuccess = true;
    }

    return {
      success: isSuccess,
      message: isSuccess
        ? "Analytics loaded successfully"
        : "Failed to load analytics data",
      analytics: isSuccess
        ? response.data.analytics
        : undefined,
    };
  } catch (error) {
    console.error("Analytics API error:", error);

    return {
      success: false,
      message: "Failed to load analytics data",
    };
  }
};

// ==========================================
// Notifications API
// ==========================================

export const getNotifications =
  async (): Promise<NotificationsResponse> => {
    try {
      // 2-second delay for loading.tsx testing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response =
        await dashboardApi.get<NotificationsResponse>(
          "/dashboard/notifications"
        );

      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Notifications API error:", error);

      return {
        success: false,
        message: "Failed to load notifications",
      };
    }
  };