// core/auth/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../../auth/services/token-storage';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);

  const token = tokenStorage.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          // Try refresh flow instead of immediate logout
          // You can call a refresh endpoint here
        } else {
          tokenStorage.clear();
          // Optionally redirect to login
        }
      }
      return throwError(() => error);
    }),
  );
};
