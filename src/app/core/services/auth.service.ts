import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable, from, map, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterPayload } from '../models/register-payload.model';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) {}

  async init(): Promise<void> {
    this.isAuthenticated$.next((await this.getToken()) !== null);
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/register`, payload);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/login`, { email, password })
      .pipe(
        switchMap((response) =>
          from(this.persistSession(response)).pipe(map(() => response)),
        ),
      );
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
    return value;
  }

  async logout(): Promise<void> {
    await Promise.all([
      Preferences.remove({ key: AUTH_TOKEN_KEY }),
      Preferences.remove({ key: AUTH_USER_KEY }),
    ]);
    this.isAuthenticated$.next(false);
  }

  private async persistSession(response: AuthResponse): Promise<void> {
    await Promise.all([
      Preferences.set({ key: AUTH_TOKEN_KEY, value: response.authorization.token }),
      Preferences.set({ key: AUTH_USER_KEY, value: JSON.stringify(response.user) }),
    ]);
    this.isAuthenticated$.next(true);
  }
}
