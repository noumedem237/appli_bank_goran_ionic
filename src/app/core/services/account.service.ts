import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, from, map, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user`);
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/logout`).pipe(
      switchMap((response) =>
        from(this.authService.logout()).pipe(
          tap(() => void this.router.navigate(['/login'])),
          map(() => response),
        ),
      ),
    );
  }
}
