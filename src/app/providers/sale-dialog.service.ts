import {Component, Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {StaffModel} from '../data-access/entities';
import {faCashRegister, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {SettingsService} from './settings.service';
import {CartItem} from '../views/master/point-of-sale/point-of-sale.component';

interface  SaleDialogData {
  staff: StaffModel[];
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SaleDialogService {

  constructor(private dialog: MatDialog) {}
  /**
   * @method
   * @name openDialog
   * @summary opens dialog to select waiter/ set status of sale and complete
   * @return void
   * @param staff
   * @param items
   * */
  openDialog(staff: StaffModel[], items: CartItem[]): Observable<any> {
    const dialogRef = this.dialog.open(CompleteSaleDialogComponent, {
      width: '450px',
      data: {staff: staff, items: items}
    });

    return dialogRef.afterClosed();
  }
}

@Component({
  selector: 'app-sale-dialog',
  template: `<h4 mat-dialog-title class="text-theme-primary text-center">{{itemsValidity? 'Complete sale': 'Warning'}}</h4>
  <div mat-dialog-content class="text-center pt-5">
      <!-- Items are valid => stackable items orderQuantities are less than their respective quantities-->
      <div *ngIf="itemsValidity">
          <div class="pre p-8 text-center text-theme-primary inline-block w-auto rounded-full border mb-4">
              <fa-icon [icon]="orderIcon" size="4x"></fa-icon>
          </div>
          <div *ngIf="config.getAllConfig().assign_waiter">
              <mat-form-field style="width: 100%;" appearance="outline">
                  <mat-label>Select waiter</mat-label>
                  <mat-select [(ngModel)]="waiter">
                      <mat-option *ngFor="let user of data.staff;let i = index;" [value]="i">{{user.firstName}}</mat-option>
                  </mat-select>
              </mat-form-field>
          </div>
      </div>
      <!-- items invalid-->
      <div *ngIf="!itemsValidity">
          <div class="image inline-block bg-yellow-dark w-auto h-auto p-5 rounded-full border">
              <fa-icon [icon]="warningIcon" size="2x"></fa-icon>
          </div>
          <div class="pt-2 pb-6">
              <p class="font-black">Attempting to order more quantities than available</p>
              <small>The items in red have lesser quantities in stock than ordered. you can:</small>
              <ol class="pl-12 text-left text-theme-primary">
                  <li>Cancel and modify item's quantity</li>
                  <li>Ignore and continue. <small>The quantity ordered will not be deducted from stock</small></li>
              </ol>
          </div>
      </div>
  </div>
  <div *ngIf="itemsValidity" style="justify-content: space-between;" mat-dialog-actions>
      <div [ngClass]="{'invisible' : config.getAllConfig().autocomplete_sales}">
          <mat-checkbox [(ngModel)]="completed"><small>Set as paid</small></mat-checkbox>
      </div>
      <div>
          <span>
              <button class="bg-theme-primary text-theme-bg" mat-stroked-button (click)="onClose(false)">Save</button>
          </span>
          <span class="ml-2">
              <button class="bg-theme-primary text-theme-bg" mat-stroked-button (click)="onClose(true)">Save & Print</button>
          </span>
          <span class="ml-2">
              <button mat-stroked-button (click)="onValidityAction(false)">cancel</button>
          </span>
      </div>
  </div>
  <div *ngIf="!itemsValidity" style="justify-content: flex-end;" mat-dialog-actions>
      <div>
          <span>
              <button class="bg-theme-primary text-theme-bg" mat-stroked-button (click)="onValidityAction(true)">continue</button>
          </span>
          <span class="ml-2">
              <button mat-stroked-button (click)="onValidityAction(false)">cancel</button>
          </span>
      </div>
  </div>
  `,
})
export class CompleteSaleDialogComponent {
  /**
   * @property lockIcon:
   */
  staff: StaffModel[];
  waiter: number = undefined;
  completed: boolean;
  // valididty of menu items
  warningIcon = faExclamationTriangle;
  orderIcon = faCashRegister;
  itemsValidity: boolean;

  constructor(
    public dialogRef: MatDialogRef<CompleteSaleDialogComponent>,
    public config: SettingsService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: SaleDialogData) {
    this.completed = this.config.get<boolean>('autocomplete_sales');
    // check validity of items
    this.itemsValidity = !this.data.items.find(it => it.stackable && it.orderQuantity > it.quantity);
    console.log(this.itemsValidity);
  }


  onClose(print = false): void {
    if (this.config.getAllConfig().assign_waiter && isNaN(this.waiter)) {
      this.snackBar.open('Please select waiter', '', {duration: 3500});
      return;
    }
    this.dialogRef.close({waiterIndex: this.waiter, print: print, completed: this.completed});
  }

  onValidityAction(action: boolean) {
    if (action) {
      this.itemsValidity = true;
    } else {
      this.dialogRef.close();
    }
  }
}
