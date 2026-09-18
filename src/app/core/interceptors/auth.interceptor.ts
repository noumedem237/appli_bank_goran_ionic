import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (/(?:^|\/)(?:register|login)(?:[/?#]|$)/.test(request.url)) {
      return next.handle(request);
    }

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const authenticatedRequest = token
          ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : request;

        return next.handle(authenticatedRequest);
      }),
    );
  }
}
