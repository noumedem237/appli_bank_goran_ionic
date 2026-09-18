import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  readonly currencies = ['XAF', 'USD', 'EUR'];
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    currency: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isSubmitting = false;
  showSuccessToast = false;
  formError = '';
  serverErrors: Record<string, string[]> = {};

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.formError = '';
    this.serverErrors = {};

    this.authService
      .register(this.form.getRawValue())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => (this.showSuccessToast = true),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  getFieldErrors(field: string): string[] {
    return this.serverErrors[field] ?? [];
  }

  redirectToLogin(): void {
    void this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 422 && error.error?.errors) {
      this.serverErrors = error.error.errors as Record<string, string[]>;
      return;
    }

    this.formError = error.error?.message ?? 'Une erreur est survenue. Veuillez réessayer.';
  }
}
