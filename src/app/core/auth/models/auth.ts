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
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}