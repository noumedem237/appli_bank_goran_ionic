import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { User } from '../../core/models/user.model';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  user?: User;
  isLoading = true;
  isLoggingOut = false;
  errorMessage = '';

  constructor(private readonly accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .getUser()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (user) => (this.user = user),
        error: () => (this.errorMessage = 'Impossible de charger vos informations pour le moment.'),
      });
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.accountService
      .logout()
      .pipe(finalize(() => (this.isLoggingOut = false)))
      .subscribe({
        error: () => (this.errorMessage = 'La déconnexion a échoué. Veuillez réessayer.'),
      });
  }
}
