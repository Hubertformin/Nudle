import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import {ReportsComponent} from './reports.component';
import {SharedModule} from '../../../modules/shared/shared.module';
import { MenuItemsReportsComponent} from './@components/menu-items-reports/menu-items-reports.component';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [ReportsComponent, MenuItemsReportsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule,
    ChartsModule
  ]
})
export class ReportsModule { }
