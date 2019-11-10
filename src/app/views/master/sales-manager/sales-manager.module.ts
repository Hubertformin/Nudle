import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SalesManagerComponent} from './sales-manager.component';
import {ViewSalesComponent} from './@components/view-sales/view-sales.component';
import {SharedModule} from '../../../modules/shared/shared.module';



@NgModule({
    declarations: [
        SalesManagerComponent,
        ViewSalesComponent,
    ],
    exports: [
        ViewSalesComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class SalesManagerModule { }
