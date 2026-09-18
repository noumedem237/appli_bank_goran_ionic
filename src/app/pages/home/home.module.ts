import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';

import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, IonicModule, HomeRoutingModule],
})
export class HomeModule {}
