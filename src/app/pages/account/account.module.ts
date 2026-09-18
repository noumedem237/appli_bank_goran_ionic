import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { AccountRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';

@NgModule({
  declarations: [AccountPage],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, AccountRoutingModule],
})
export class AccountModule {}
