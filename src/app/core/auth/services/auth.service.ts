import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY, tap, catchError } from 'rxjs';

import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  PinLoginRequest,
  RegisterUserRequest
} from '../models/auth';

import { TokenStorageService } from '../../auth/services/token-storage';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly apiUrl = environment.apiBaseUrl;

  private readonly _currentUser = signal<AuthUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isAuthenticated = computed(() =>
    this.tokenStorage.accessToken() !== null
  );

  constructor() {
    this.initialize();
  }

  /**
   * Called once when the application starts.
   * Reloads the logged-in user's profile if a token exists.
   */
  private initialize(): void {
    if (!this.tokenStorage.hasToken()) {
      return;
    }

    this.refreshUser();
  }

  /**
   * Username/Password Login
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    //console.log('loginWithPin called with request:', request); // Debugging line
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => this.handleLoginSuccess(response))
      );
  }

  /**
   * PIN Login
   */
  loginWithPin(request: PinLoginRequest): Observable<LoginResponse> {
    //console.log('loginWithPin called with request:', request); // Debugging line
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => this.handleLoginSuccess(response))
      );
  }

  // auth.service.ts
registerUser(request: RegisterUserRequest): Observable<any> {
  return this.http
    .post<any>(`${this.apiUrl}/auth/register`, request)
    .pipe(
      tap(response => {
        console.log('User registered successfully:', response);
      }),
      catchError(err => {
        console.error('Registration failed:', err);
        return EMPTY; // or throwError(() => err) if you want to propagate
      })
    );
}


  /**
   * Reload logged-in user.
   * Expected endpoint:
   * GET /auth/me // instead of API checking hastoken of tokenStorage
   */
  refreshUser(): boolean {
    const hasToken = this.tokenStorage.hasToken();

    if (!hasToken) {
      this.logout();
    }

    return hasToken;
  }


  /**
   * Save login response.
   */
  private handleLoginSuccess(response: LoginResponse): void {
    console.log('handleLoginSuccess called with response:', response); // Debugging line
    //console.log('Access Token:', response.access_token); // Debugging line
    this.tokenStorage.setTokens(
      response.access_token,
      response.refresh_token
    );

    //this._currentUser.set(response.user);
  }

  /**
   * Logout user.
   */
  logout(): void {
    this.tokenStorage.clear();
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Returns true if current user has the specified role.
   */
  hasRole(role: string): boolean {
    const user = this._currentUser();

    if (!user) {
      return false;
    }

    return user.roles?.includes(role) ?? false;
  }
}