import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Lista di URL che NON richiedono autenticazione
  const publicUrls = [
    '/auth/login',
    '/auth/refresh',
    '/auth/verify'
  ];

  // Registrazione (POST /api/users/) non richiede token
  const isPublicRequest = publicUrls.some(url => req.url.includes(url)) ||
                         (req.url.includes('/users/') && req.method === 'POST' && !req.url.includes('/users/me'));

  // Aggiungi il token se esiste e non è una richiesta pubblica
  if (token && !isPublicRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // Se riceviamo un errore 401, proviamo a fare refresh del token
      if (error.status === 401 && !isPublicRequest) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry della richiesta originale con il nuovo token
            const newToken = authService.getToken();
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(req);
          }),
          catchError(refreshError => {
            // Se anche il refresh fallisce, logout
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

