import { Injectable, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'harbor_access_token';
const LOGGED_IN_USERNAME = 'UserName';
const LOGGED_IN_EMAIL = 'userEmail'
const REFRESH_TOKEN_KEY = 'harbor_refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private readonly _accessToken = signal<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  
  private readonly _userName = signal<string | null>(
    localStorage.getItem(LOGGED_IN_USERNAME)
  );

  private readonly _userEmail = signal<string | null>(
    localStorage.getItem(LOGGED_IN_EMAIL)
  );

  readonly accessToken = this._accessToken.asReadonly();
  readonly userName = this._userName.asReadonly();
  readonly userEmail = this._userEmail.asReadonly();

  getAccessToken(): string | null {
    return this._accessToken();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    //console.log('Setting tokens:', { accessToken, refreshToken }); // Debug
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    this._accessToken.set(accessToken);
  }

  setuserName(userName: string): void {
    //console.log('Setting tokens:', { accessToken, refreshToken }); // Debug
    localStorage.setItem(LOGGED_IN_USERNAME, userName);

    this._userName.set(userName);
  }

  setuserEmail(userEmail: string): void {
    //console.log('Setting tokens:', { accessToken, refreshToken }); // Debug
    localStorage.setItem(LOGGED_IN_EMAIL, userEmail);

    this._userEmail.set(userEmail);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    this._accessToken.set(null);
  }

  hasToken(): boolean {
    return !!this._accessToken();
  }
}