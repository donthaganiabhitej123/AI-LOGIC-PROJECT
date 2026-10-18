import axios from "axios";

// ==========================================
// AXIOS INSTANCE
// ==========================================


const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// REUSABLE ERROR HANDLING

// ==========================================

export const handleApiError = (error: unknown): string => {
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const backendMessage: unknown = error.response?.data?.message;

    const message =
      typeof backendMessage === "string"
        ? backendMessage
        : undefined;

    if (!error.response) {
      if (
        error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT"
      ) {
        return "The request timed out. Please try again.";
      }

      if (error.code === "ERR_CANCELED") {
        return "The request was cancelled.";
      }

      return "Unable to connect to the server. Please try again.";
    }

    switch (status) {
      case 400:
        return message || "Invalid request. Please check your input.";

      case 401:
        return message || "Your session has expired. Please log in again.";

      case 403:
        return message || "You do not have permission to perform this action.";

      case 404:
        return message || "The requested resource was not found.";

      case 408:
        return message || "The request timed out. Please try again.";

      case 409:
        return message || "The request conflicts with existing data.";

      case 413:
        return message || "The uploaded file is too large.";

      case 415:
        return message || "This file type is not supported.";

      case 422:
        return message || "Please check the submitted data.";

      case 429:
        return message || "Too many requests. Please try again later.";

      default:
        if (status !== undefined && status >= 500) {
          return "A server error occurred. Please try again later.";
        }

        return message || "The request failed. Please try again.";
    }
  }

  if (error instanceof Error) {
    return "An unexpected error occurred. Please try again.";
  }

  return "Something went wrong. Please try again.";
};

// ==========================================
// USER INTERFACE
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// ==========================================
// LOGIN INTERFACES
// ==========================================

export interface LoginUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: LoginUser;
}
//logout response
export interface LogOutResponse{
  success:boolean;
  message?:string;
}

// ==========================================
// USER RESPONSE INTERFACES
// ==========================================

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  user: User;
}

// ==========================================
// FILE INTERFACES
// ==========================================

export interface UploadedFile {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface FilesResponse {
  success: boolean;
  files: UploadedFile[];
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  file: UploadedFile;
}

// ==========================================
// CHAT INTERFACES
// ==========================================

export interface ChatResponse {
  success: boolean;
  message: string;
}

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      "/login",
      { email, password }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const backendMessage: unknown =
        error.response?.data?.message;

      const message =
        typeof backendMessage === "string"
          ? backendMessage
          : undefined;

      if (status === 400) {
        return {
          success: false,
          message: message || "Please check your input.",
        };
      }

      if (status === 401) {
        return {
          success: false,
          message: message || "Invalid email or password.",
        };
      }

      if (status === 403) {
        return {
          success: false,
          message: message || "You are not authorized to log in.",
        };
      }

      if (status === 404) {
        return {
          success: false,
          message: "Login endpoint not found.",
        };
      }

      if (status === 429) {
        return {
          success: false,
          message: message || "Too many login attempts. Try again later.",
        };
      }

      if (!error.response) {
        return {
          success: false,
          message:
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
              ? "Login request timed out. Please try again."
              : "Unable to connect. Check your connection and try again.",
        };
      }

      if (status !== undefined && status >= 500) {
        return {
          success: false,
          message: "Server error. Please try again later.",
        };
      }

      return {
        success: false,
        message: message || "Login failed. Please try again.",
      };
    }

    console.error("Unexpected login error:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
//logout


export const LogoutUser =async (): Promise<LogOutResponse> =>{
  const response = await api.post<LogOutResponse>("/logout");
  return response.data;
}
// ===========================================>
// GET ALL USERS
// ==========================================

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<UsersResponse>("/users");
    return response.data.users;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 ||
        error.response?.status === 403)
    ) {
      // Preserve RBAC. The caller decides how to handle access denial.
      throw error;
    }

    console.error("Get users error:", error);
    throw error;
  }
};

// ==========================================
// CREATE USER
// ==========================================

export const createUser = async (
  name: string,
  email: string,
  age: number,
  password: string
): Promise<User> => {
  try {
    const response = await api.post<UserResponse>("/users", {
      name,
      email,
      age,
      password,
    });

    return response.data.user;
  } catch (error: unknown) {
    console.error("Create user error:", error);
    throw error;
  }
};

// ==========================================
// UPDATE USER
// ==========================================

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  age: number
): Promise<User> => {
  try {
    const response = await api.put<UserResponse>(
      `/users/${id}`,
      {
        name,
        email,
        age,
      }
    );

    return response.data.user;
  } catch (error: unknown) {
    console.error("Update user error:", error);
    throw error;
  }
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (
  id: number
): Promise<User> => {
  try {
    const response = await api.delete<UserResponse>(`/users/${id}`);
    return response.data.user;
  } catch (error: unknown) {
    console.error("Delete user error:", error);
    throw error;
  }
};

// ==========================================
// GET ALL FILES
// ==========================================

export const getFiles = async (): Promise<UploadedFile[]> => {
  try {
    const response = await api.get<FilesResponse>("/files");
    return response.data.files;
  } catch (error: unknown) {
    console.error("Get files error:", error);
    throw error;
  }
};

// ==========================================
// UPLOAD FILE WITH PROGRESS
// ==========================================

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<FileUploadResponse>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );

            onProgress?.(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("File upload error:", error);
    throw error;
  }
};

// ==========================================
// DOWNLOAD FILE WITH PROGRESS
// ==========================================

export const downloadFile = async (
  id: number,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  try {
    const response = await api.get<Blob>(
      `/files/${id}/download`,
      {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );

            onProgress?.(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("File download error:", error);
    throw error;
  }
};

// ==========================================
// SEND CHAT MESSAGE
// ==========================================

export const sendChatMessage = async (
  message: string,
  receiverSocketId?: string
): Promise<ChatResponse> => {
  try {
    const response = await api.post<ChatResponse>(
      "/chat/message",
      {
        message,
        receiverSocketId,
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Send chat message error:", error);
    throw error;
  }
};

// ==========================================
// EXPORT AXIOS INSTANCE
// ==========================================

export default api;