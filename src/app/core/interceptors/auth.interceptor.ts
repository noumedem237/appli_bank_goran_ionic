import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EMPTY, Observable, catchError, from, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isHandlingUnauthorized = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastController: ToastController,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthenticationRequest = /(?:^|\/)(?:register|login)(?:[/?#]|$)/.test(request.url);
    if (isAuthenticationRequest) {
      return next.handle(request);
    }

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const authenticatedRequest = token
          ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : request;

        return next.handle(authenticatedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status !== 401 || this.isHandlingUnauthorized) {
              return throwError(() => error);
            }

            return from(this.handleUnauthorized()).pipe(
              switchMap(() => EMPTY),
            );
          }),
        );
      }),
    );
  }

  private async handleUnauthorized(): Promise<void> {
    this.isHandlingUnauthorized = true;
    try {
      await this.authService.logout();
      await this.router.navigate(['/login']);
      const toast = await this.toastController.create({
        message: 'Session expirée, veuillez vous reconnecter',
        duration: 3000,
        color: 'warning',
        position: 'top',
      });
      await toast.present();
    } finally {
      this.isHandlingUnauthorized = false;
    }
  }
}
