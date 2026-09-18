import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { User } from '../../core/models/user.model';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false,
})
export class AccountPage implements OnInit {
  readonly form = this.formBuilder.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  user?: User;
  isLoading = true;
  isSubmitting = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';
  showToast = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  credit(): void {
    this.submit('credit');
  }

  debit(): void {
    this.submit('debit');
  }

  dismissToast(): void {
    this.showToast = false;
  }

  private loadUser(): void {
    this.isLoading = true;
    this.accountService
      .getUser()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (user) => (this.user = user),
        error: (error: HttpErrorResponse) => this.openErrorToast(this.getErrorMessage(error)),
      });
  }

  private submit(operation: 'credit' | 'debit'): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    const amount = Number(this.form.controls.amount.value);
    this.isSubmitting = true;
    const request = operation === 'credit'
      ? this.accountService.credit(amount)
      : this.accountService.debit(amount);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: () => {
        this.form.reset();
        this.openSuccessToast(operation === 'credit' ? 'Compte crédité avec succès.' : 'Compte débité avec succès.');
        this.loadUser();
      },
      error: (error: HttpErrorResponse) => this.openErrorToast(this.getErrorMessage(error)),
    });
  }

  private openSuccessToast(message: string): void {
    this.toastColor = 'success';
    this.toastMessage = message;
    this.showToast = true;
  }

  private openErrorToast(message: string): void {
    this.toastColor = 'danger';
    this.toastMessage = message;
    this.showToast = true;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const errors = error.error?.errors as Record<string, string[] | string> | undefined;
    if (errors) {
      const firstError = Object.values(errors)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      if (typeof firstError === 'string') {
        return firstError;
      }
    }

    return error.error?.message ?? 'Une erreur est survenue. Veuillez réessayer.';
  }
}
