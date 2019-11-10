import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {faCheckCircle, faChevronDown, faList, faPrint, faSearch, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {SettingsService} from '../../../providers/settings.service';
import {DbService} from '../../../providers/db.service';
import {SaleModel} from '../../../data-access/entities';
import * as $ from 'jquery';
import {MatSnackBar} from '@angular/material';
import {SatDatepickerInputEvent} from 'saturn-datepicker';
import {ElectronService} from '../../../providers/electron.service';

/*export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};*/

declare type viewType = 'full' | 'compact';
@Component({
  selector: 'app-invoices-manager',
  templateUrl: './sales-manager.component.html',
  styleUrls: ['./sales-manager.component.scss'],
  // providers: [
  //   // The locale would typically be provided on the root module of your application. We do it at
  //   // the component level here, due to limitations of our example generation script.
  //   {provide: MAT_DATE_LOCALE, useValue: 'en-gb'},
  //
  //   // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
  //   // `MatMomentDateModule` in your applications root module. We provide it at the component level
  //   // here, due to limitations of our example generation script.
  //   {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  //   {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  // ]
})
export class SalesManagerComponent implements OnInit, OnDestroy {
  @Input() display: viewType;
  dropDownIcon = faChevronDown;
  deleteIcon = faTrashAlt;
  completeIcon = faCheckSquare;
  viewIcon = faList;
  checkIcon = faCheckCircle;
  crossIcon = faTimesCircle;
  searchIcon = faSearch;
  uncompletedIcon = faTimesCircle;
  saleItems: SaleModel[] = [];
  printIcon = faPrint;
  // default date view
  selectedSaleItem: SaleModel;

  constructor(public config: SettingsService, private db: DbService, private snackBar: MatSnackBar, public electron: ElectronService) { }

  ngOnInit() {
    this.display = this.display ? this.display : 'full';
    // get records of today
    this.db.getSaleByDate('today')
      .then(data => {
        this.saleItems = [...data];
        console.log(this.saleItems);
      });
  }
  //
  ngOnDestroy(): void {
    console.log('Sales manager ended.');
  }

  get totalAmountOfMoney(): number {
    let total = 0;
    this.saleItems.forEach(el => {
      total += Number(el.totalAmount);
    });
    return total;
  }


  getSales(event: MouseEvent, date: string) {
    // first hide preview pane
    this.closeViewSelected();
    // get sales
    if (date === 'all') {
      this.db.getAllSale()
        .then(data => {
          $('ul.list  li').removeClass('active');
          $(event.target).addClass('active');
          this.saleItems = [...data];
        });
    } else {
      this.db.getSaleByDate(date)
        .then(data => {
          $('ul.list  li').removeClass('active');
          $(event.target).addClass('active');
          this.saleItems = [...data];
          // set active class
        });
    }
  }

  deleteSale(id: number) {
    if (confirm('Are you sure to delete this item?')) {
      this.db.deleteSale(id)
        .then(data => {
          if (data.status) {
            this.saleItems = this.saleItems.filter(el => el.id !== id);
          } else {
            this.snackBar.open('Error deleting entry', 'close', {duration: 2500});
          }
        });
    }
  }

  toggleSaleStatus(id: number, completed: boolean) {
    this.db.toggleSaleStatus(id, !completed)
      .then(data => {
        console.log(data);
        this.saleItems = this.saleItems.map(el => {
          if (el.id === id) {
            el.completed = !el.completed;
          }
          return el;
        });
      }).catch((err) => {
        console.error(err);
        this.snackBar.open('Error changing completed status', 'close', {duration: 2500});
    });
  }

  view(index: any) {
    this.selectedSaleItem = this.saleItems[index];
    this.toggleViewSelected();
  }

  toggleViewSelected() {
    $('#viewSelectedSale').fadeToggle('fast');
  }
  closeViewSelected() {
    $('#viewSelectedSale').fadeOut('fast');
  }

  searchSales() {
    const q = $('#searchSalesInput').val();
    this.db.searchSale(q)
      .then(data => {
        this.saleItems = [...data];
        console.log(data);
        this.closeViewSelected(); // close view showing selected item is open..
      });
  }

  printSaleItem(index: number | any) {
    if (confirm('Print this invoice?')) {
      const sale = typeof index === 'number' ? this.saleItems[index] : index;
      // TODO: print request
      const printJob = {
        invoiceNumber: sale.invoiceNumber,
        totalAmount: sale.totalAmount,
        tableId: sale.tableId,
        menuItems: sale.menuItemConnection.map(el => {
          (el.menuItem as any).orderQuantity = (el as any).orderQuantity;
          return el.menuItem;
        }),
        cashier: sale.cashier,
        waiter: sale.waiter,
        discount: sale.discount,
        completed: sale.completed,
        branch: sale.branch,
      };
      // print
      this.electron.ipcRenderer.send('print-sale', JSON.stringify(printJob));
    }
  }

  onDateSelected(event: SatDatepickerInputEvent<unknown>) {
    // first hide preview pane
    this.closeViewSelected();
    // remove active classes from left pane
    $('ul.list  li').removeClass('active');
    // get date intervals...
    const startDate = (event.value as any).begin;
    const endDate = (event.value as any).end;
    // console.log(event.value);
    this.db.getSaleByDateRange(startDate.toISOString(), endDate.toISOString())
      .then(data => {
        $('ul.list  li').removeClass('active');
        this.saleItems = [...data];
        // set active class
      });
  }
}
