import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import {PointOfSaleComponent} from './point-of-sale/point-of-sale.component';
import {ViewStaffComponent} from './view-staff/view-staff.component';
import {CompanyComponent} from './company/company.component';
// import {BranchesComponent} from './branches/branches.component';
import {MenuItemsComponent} from './menu-items/menu-items.component';
import {MenuTablesComponent} from './menu-tables/menu-tables.component';
// import {WasteEventsComponent} from './waste-events/waste-events.component';
import {InventoryComponent} from './inventory/inventory.component';
import {StaffGroupComponent} from './staff-group/staff-group.component';
import {CreateStaffComponent} from './create-staff/create-staff.component';
import {EditStaffComponent} from './edit-staff/edit-staff.component';
// import {CookBookComponent} from './cook-book/cook-book.component';
import {SharedModule} from '../../modules/shared/shared.module';
import { MasterComponent } from './master.component';
// import {DashboardComponent} from './dashboard/dashboard.component';
import { UsersActivityComponent } from './users-activity/users-activity.component';
// import { CreateBranchComponent } from './create-branch/create-branch.component';
import {SettingsModule} from './settings/settings.module';
import {SalesManagerModule} from './sales-manager/sales-manager.module';
import {ReportsModule} from './reports/reports.module';
import {ExpensesComponent} from './expenses/expenses.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {AppModule} from '../../app.module';

@NgModule({
  declarations: [
    PointOfSaleComponent,
    ViewStaffComponent,
    // DashboardComponent,
    CompanyComponent,
    // BranchesComponent,
    MenuItemsComponent,
    MenuTablesComponent,
    // WasteEventsComponent,
    InventoryComponent,
    StaffGroupComponent,
    ViewStaffComponent,
    CreateStaffComponent,
    EditStaffComponent,
    // CookBookComponent,
    MasterComponent,
    ExpensesComponent,
    UsersActivityComponent,
    // CreateBranchComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        MasterRoutingModule,
        ReportsModule,
        SalesManagerModule,
        SettingsModule,
    ],
})
export class MasterModule { }
