import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

@NgModule({ declarations: [LoginPage], imports: [LoginRoutingModule] })
export class LoginModule {}
