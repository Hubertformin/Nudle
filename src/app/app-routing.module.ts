import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthGuardService as AuthGuard} from './providers/auth-guard.service';

import {SetUpComponent} from './views/set-up/set-up.component';
import {LoginComponent} from './views/login/login.component';
import {MasterComponent} from './views/master/master.component';
import {PointOfSaleComponent} from './views/master/point-of-sale/point-of-sale.component';
import {MenuItemsComponent} from './views/master/menu-items/menu-items.component';
import {MenuTablesComponent} from './views/master/menu-tables/menu-tables.component';
import {InventoryComponent} from './views/master/inventory/inventory.component';
import {SalesManagerComponent} from './views/master/sales-manager/sales-manager.component';
import {CreateStaffComponent} from './views/master/create-staff/create-staff.component';
import {ViewStaffComponent} from './views/master/view-staff/view-staff.component';
import {EditStaffComponent} from './views/master/edit-staff/edit-staff.component';
import {CompanyComponent} from './views/master/company/company.component';
import {ReportsComponent} from './views/master/reports/reports.component';
import {UsersActivityComponent} from './views/master/users-activity/users-activity.component';
import {SettingsComponent} from './views/master/settings/settings.component';
import {ProfileConfigComponent} from './views/master/settings/@components/profile-config/profile-config.component';
import {SubscriptionConfigComponent} from './views/master/settings/@components/subscription-config/subscription-config.component';
import {AppearanceConfigComponent} from './views/master/settings/@components/appearance-config/appearance-config.component';
import {LanguageConfigComponent} from './views/master/settings/@components/language-config/language-config.component';
import {InvoicesConfigComponent} from './views/master/settings/@components/invoices-config/invoices-config.component';
import {PrinterConfigComponent} from './views/master/settings/@components/printer-config/printer-config.component';
import {StartUpConfigComponent} from './views/master/settings/@components/start-up-config/start-up-config.component';
import {PrivacyConfigComponent} from './views/master/settings/@components/privacy-config/privacy-config.component';
import {AboutConfigComponent} from './views/master/settings/@components/about-config/about-config.component';
import {ExpensesComponent} from './views/master/expenses/expenses.component';
import {SetUpActivateService} from './providers/set-up-activate.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [SetUpActivateService]
  },
  {path: 'login', component: LoginComponent},
  {
    path: 'set-up',
    component: SetUpComponent
  },
  /*{
    path: 'master',
    loadChildren: () => import('./views/master/master.module').then((mod) => mod.MasterModule)
  },*/
  {
    path: 'master',
    component: MasterComponent,
    canActivate: [AuthGuard],
    children: [
      // {path: 'dashboard', component: DashboardComponent},
      {
        path: 'point-of-sale',
        component: PointOfSaleComponent
      },
      {
        path: 'menuItems',
        component: MenuItemsComponent
      },
      {
        path: 'menuTables',
        component: MenuTablesComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        // renaming this url path, you'll have to change it in master module and in startup-config view
        path: 'sales-manager',
        component: SalesManagerComponent
      },
      {
        path: 'purchases',
        component: ExpensesComponent
      },
      // {path: 'cook-book', component: CookBookComponent},
      // {path: 'waste-events', component: WasteEventsComponent},
      {
        path: 'staff/create',
        component: CreateStaffComponent
      },
      {
        path: 'staff',
        component: ViewStaffComponent
      },
      {
        path: 'staff/edit/:id',
        component: EditStaffComponent
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      /*{
        path: 'branches',
        component: BranchesComponent
      },*/
      /*{
        path: 'branches/add',
        component: CreateBranchComponent
      },*/
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {path: 'profile', component: ProfileConfigComponent},
          {path: 'subscription', component: SubscriptionConfigComponent},
          {path: 'appearance', component: AppearanceConfigComponent},
          {path: 'language', component: LanguageConfigComponent},
          {path: 'invoices', component: InvoicesConfigComponent},
          // {path: 'reports', component: ReportsConfigComponent},
          {path: 'printer', component: PrinterConfigComponent},
          {path: 'start-up', component: StartUpConfigComponent},
          {path: 'privacy', component: PrivacyConfigComponent},
          {path: 'about', component: AboutConfigComponent},
        ]
      },
      {
        path: 'users-activity',
        component: UsersActivityComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'master/reports'
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
