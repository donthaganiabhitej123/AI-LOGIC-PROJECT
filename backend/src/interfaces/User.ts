export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
  password: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  age: number;
}