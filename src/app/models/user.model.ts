export interface User {
  id: number;
  email: string;
  display_name: string;
  role: number;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  display_name: string;
}

