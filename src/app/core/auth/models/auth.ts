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
  user?: AuthUser; // optional since backend doesn’t send it
}
