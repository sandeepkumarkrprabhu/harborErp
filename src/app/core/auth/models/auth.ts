export interface LoginRequest {
  email: string;
  password: string;
}

export interface PinLoginRequest {
  email: string;
  pin: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token?: string;
  user: AuthUser; 
  name: string;
  email: string;
  username: string;
}


// models/auth.ts
export interface RegisterUserRequest {
  name: string;
  email: string;
  role_id: string; 
  github_username: string;
  requires_github_access: boolean;
  status: boolean;
  projects: [];
}