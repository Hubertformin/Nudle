import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {ContextMenuComponent} from 'ngx-contextmenu';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {faCheckSquare, faClock, faExclamationTriangle, faPlusCircle, faTrash} from '@fortawesome/free-solid-svg-icons';
import {SettingsService} from '../../../providers/settings.service';
import * as $ from 'jquery';
import {MenuItemModel, StaffModel} from '../../../data-access/entities';
import {FormBuilder} from '@angular/forms';
import {DbService} from '../../../providers/db.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {AuthService} from '../../../providers/auth.service';
import {MatSnackBar} from '@angular/material';
import {SaleDialogService} from '../../../providers/sale-dialog.service';
import {ElectronService} from '../../../providers/electron.service';
import {Router} from '@angular/router';

export interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  orderQuantity: number; // quantity ordered
  stackable: boolean;
  quantity: number; // quantity in stock
  discount?: number;
  ingredients: any[];
  category: any;
  amount?: number;
}

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.scss']
})
export class PointOfSaleComponent implements OnInit, AfterViewInit {
  // @ViewChild(ContextMenuComponent, { static: true }) public basicMenu: ContextMenuComponent;
  addIcon = faPlusCircle;
  completeIcon = faCheckSquare;
  warningIcon = faExclamationTriangle;
  // search queries
  searchQueries: Observable<MenuItemModel[]>;
  searchText$ = new Subject<string>();
  selectedItems: CartItem[];
  // branches: BranchModel[];
  deleteIcon = faTrash;
  recentItemIcon = faClock;
  recentItems: CartItem[];
  // sale form
  saleForm = this.formBuilder.group({
    invoiceNumber: [null],
    tableId: [null],
    waiter: [null],
    discount: [null]
  });
  //  the form group used to add menu items to cart
  itemCartForm = this.formBuilder.group({
    id: [null],
    name: [null],
    quantity: [null],
    orderQuantity: [null],
    stackable: [false],
    ingredients: [null],
    unitPrice: [null],
    category: [null],
    amount: [null],
  });
  staff: StaffModel[];
  noSearchResults = false;
  showSavePlaceholder = false;

  constructor(private db: DbService,
              public config: SettingsService, private formBuilder: FormBuilder,
              private auth: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,
              private saleDialog: SaleDialogService, private electron: ElectronService
  ) { }

  ngOnInit() {
    this.selectedItems = [];
    this.recentItems = (window.sessionStorage.getItem('recent_items')) ? JSON.parse(window.sessionStorage.getItem('recent_items')) : [];
    // set up debouncing request for search...
    this.searchQueries = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((itemName, index) => {
        return this.db.searchMenuItems(itemName, 7);
      })
    );
  }

  ngAfterViewInit(): void {
    // get branches
    // this.db.getBranches().subscribe(branches => this.branches = branches);
    // get all staff
    this.db.getAllStaff()
      .then(data => this.staff = data);
    // subscribe to changes in searchQueries
    this.searchQueries.subscribe(items => {
      // if no search results hide pop up
      if (items.length === 0) {
        this.noSearchResults = true;
      } else {
        this.noSearchResults = false;
        this.openSearchPopUp();
      }
    });
    // get new invoice number
    this.getNewInvoiceNumber();
    // listen for printer events
    this.electron.ipcRenderer.on('print-sale-status', (evt, arg) => {
      const st = JSON.parse(arg);
      if (st.status) {
        this.snackBar.open('Added to printer queue', 'close', {duration: 2500, horizontalPosition: 'end'});
      } else {
        this.snackBar.open('Error printing, make sure printer is connected', 'close', {duration: 2500, horizontalPosition: 'end'});
      }
    });
  }
  // generate new random invoice number
  getNewInvoiceNumber() {
    // get sale count
    this.db.getSaleCount()
      .then((countRes) => {
        const date = new Date(),
          counter = countRes.count;

        const year = date.getFullYear().toString().slice(-2),
          month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString(),
          day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString();
        // patch form
        this.saleForm.patchValue({
          invoiceNumber: year + month + day + 'S' + Math.pow(10, 4 - counter.toString().length).toString().slice(1) + counter
        });
      });
  }
  // get signed in user
  get auth_user() {
    return this.auth.getAuthUser();
  }
  // get currency
  get config_currency() {
    return this.config.get('company_currency');
  }
  // get total amount of selected items
  get totalCartAmount(): number {
    let amount = 0;
    this.selectedItems.forEach(el => {
      amount += el.amount;
    });
    return amount;
  }

  /**
   * Method called when element dropped into selected items container.
   * */
  drop(event: CdkDragDrop<CartItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(event.previousContainer.data, event.container.data);
    } else {
      const item_exist: boolean = !!event.container.data.find(item => item.id === event.previousContainer.data[event.previousIndex].id);
      if (item_exist) {
        this.selectedItems = this.selectedItems.map(item => {
          if (item.id === event.previousContainer.data[event.previousIndex].id) {
            item.orderQuantity += 1;
            item.amount = item.unitPrice * item.orderQuantity;
          }
          return item;
        });
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
    }
  }
  // close search pop up el
  openSearchPopUp() {
    $('#item-search-popup').fadeIn('fast');
  }
  closeSearchPopUp() {
    $('#item-search-popup').fadeOut('fast');
  }
  // search database for values
  search(itemName: string) {
    // Exit method is search query (itemName) is undefined or empty
    if (itemName === '' || !itemName) {
      this.closeSearchPopUp();
      return;
    }
    this.searchText$.next(itemName);
    /*this.db.searchMenuItems(item)
      .subscribe(data => {
        // if no search results hide pop up
        if (data.length === 0 || item === '') {
          $('#item-search-popup').fadeOut('fast');
        } else {
          $('#item-search-popup').fadeIn('fast');
        }
        // passing search query results
        console.log(data);
        this.SearchQueries = data;
      });*/
  }
  // add item to cart
  addItemToList() {
    // quit function if, no item has been added to form
    if (!this.itemCartForm.get('id').value) {
      return;
    }
    // check if current selected item already exist!
    const item_exist_index = this.selectedItems.findIndex(item => item.id === this.itemCartForm.get('id').value);
    // if it exist increment quantity else, add item
    if (item_exist_index > -1) {
      this.selectedItems[item_exist_index].orderQuantity += Number(this.itemCartForm.get('orderQuantity').value);
      this.selectedItems[item_exist_index].amount += this.selectedItems[item_exist_index].orderQuantity * this.selectedItems[item_exist_index].unitPrice;
    } else {
      this.selectedItems.push({
        id: this.itemCartForm.get('id').value,
        name: this.itemCartForm.get('name').value,
        unitPrice: Number(this.itemCartForm.get('unitPrice').value),
        stackable: this.itemCartForm.get('stackable').value,
        orderQuantity: Number(this.itemCartForm.get('orderQuantity').value),
        quantity: Number(this.itemCartForm.get('quantity').value),
        ingredients: this.itemCartForm.get('ingredients').value,
        category: this.itemCartForm.get('category').value,
        amount: Number(this.itemCartForm.get('orderQuantity').value) * Number(this.itemCartForm.get('unitPrice').value)
      });
    }
    console.log(this.selectedItems);
    // reset form...
    this.itemCartForm.reset();
  }
  /**
   * REMOVE ITEM FROM THE LIST OF SELECTED ITEMS
   * */
  removeFromList(index: number) {
    this.selectedItems.splice(index, 1);
  }

  addItemToCartForm(item) {
    this.itemCartForm.patchValue({
      id: item.id,
      name: item.name,
      unitPrice: item.unitPrice,
      orderQuantity: 1,
      ingredients: item.ingredients,
      stackable: item.stackable,
      quantity: item.quantity,
      category: item.category,
      discount: 0
    });
    // hide preview pane
    $('#item-search-popup').fadeOut('fast');
  }

  onQuantityModify(index: number) {
    this.selectedItems[index].amount = this.selectedItems[index].orderQuantity * this.selectedItems[index].unitPrice;
  }
  /**
   * @name completeOrder
   * @description save order to db
   * complete order method
   * */
  completeOrder() {
    this.saleDialog.openDialog(this.staff, this.selectedItems)
      .subscribe(dialogAction => {
        if (typeof dialogAction !== 'object') {
          return;
        }
        // reject method if dialog action is set to print and printer is not defined
        if (dialogAction.print && !this.config.getAllConfig().printer_name) {
          const sbRef = this.snackBar.open('Unable to print, printer not configured', 'Fix', {duration: 6500});
          sbRef.onAction()
              .subscribe(() => {
                this.router.navigate(['/master/settings/printer']);
              });
          return;
        }
        // show placeholder
        this.showSavePlaceholder = true;
        // create sale object
        const sale = {
          invoiceNumber: this.saleForm.get('invoiceNumber').value,
          totalAmount: this.totalCartAmount,
          tableId: this.saleForm.get('tableId').value,
          menuItems: this.selectedItems,
          cashier: this.auth_user,
          waiter: this.staff[dialogAction.waiterIndex],
          discount: this.saleForm.get('discount').value,
          completed: dialogAction.completed,
          // branch: this.branches[0],
        };
        // adding to database...
        this.db.addSale(sale)
          .then((data) => {
            // print order if printer name is defined...
            if (dialogAction.print && this.config.getAllConfig().printer_name) {
              this.electron.ipcRenderer.send('print-sale', JSON.stringify(sale));
            }
            // if backend replied with a status of true..
              // hide placeholder
              this.showSavePlaceholder = false;
              this.snackBar.open('Order complete', 'close', {duration: 2500});
              // console.log(data);
              // get recent items from selected items
              this.recentItems = [...this.selectedItems, ...this.recentItems];
              this.recentItems = this.recentItems.slice(0, 4);
              // remove duplicated from recent array
              this.recentItems = this.removeDuplicates<CartItem[]>(this.recentItems);
              // set quantities to 1
              this.recentItems = this.recentItems.map(el => {
                el.orderQuantity = 1;
                el.amount = el.unitPrice;
                return el;
              });
              // empty the cart of selected items
              this.selectedItems = [];
              // get new invoice number
              this.getNewInvoiceNumber();

      }).catch(err => {
        console.error(err);
          this.snackBar.open('Failed to complete sale', 'close', {duration: 3500});
        });
  });
  }
  /**
   * @method
   * @name removeDuplicates
   * **/
  removeDuplicates<T>(array): T {
    return array.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.id === thing.id && t.name === thing.name
      ))
    );
  }
  /**
   * @method
   * @name print
   * */
  // printJob(data) {
  //   const d = new Date();
  //   const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ,${d.getHours()}:${d.getMinutes()}`;
  //   let print_data: PosPrintData[] = [
  //     {
  //       type: 'text',
  //       value: '<h1 style="margin-bottom: 0;">' + this.config.getAllConfig().company_name + '</h1>',
  //       style: `font-family:monospace, cursive;text-align:center;font-weight:bold;`
  //     }, {
  //       type: 'text',
  //       value: `${data.invoiceNumber}${(this.config.getAllConfig().assign_waiter) ? ' - ' + data.waiter.firstName : ''}`,
  //       style: `text-align:center;font-size:0.7rem;font-weight:bold;margin: 2%;font-family:monospace, cursive;`
  //     },
  //     {
  //       type: 'text',
  //       value: date,
  //       style: `font-size: 11px;text-align:center;font-family:monospace, cursive;`
  //     }];
  //   // FileSaver.js
  //   let th = '';
  //   data.menuItems.forEach(el => {
  //     /*products.orderCategories.map((il) => {
  //       if (el.orderCategory === il.name) {
  //         il.template +=  `<tr style="border-bottom:1px dotted #999;padding:5px 0;text-align:center;">
  //            <td style="padding:7px 2px;">${el.name}</td>
  //            <td style="padding:7px 2px;">${el.quantity}</td></tr>`;
  //       }
  //     });*/
  //     th += `<tr style="border-bottom:1px dotted #999;padding:5px 0;text-align:center;">
  //            <td style="padding:7px 2px;">${el.name}</td>
  //            <td style="padding:7px 2px;">${el.orderQuantity}</td>
  //            <td style="padding:7px 2px;">${new CurrencyPipe('en-GB').transform(el.unitPrice, '', 'symbol', '1.0')}</td>
  //        </tr>`;
  //     // <td style="padding:7px 2px;">${PrinterAction.currency$(el.amount * el.quantity)}</td>
  //   });

  //   print_data = print_data.concat([
  //     {
  //       type: 'text',
  //       value: `<div style="min-height:275px;">
  //      <table style="width: 100%;display: table;border-collapse: collapse;border-spacing: 0;margin:15px 0;font-family:monospace, cursive;">
  //       <thead>
  //          <th>Item</th>
  //          <th>Qty</th>
  //          <th>Price</th>
  //      </thead>
  //       <tbody style="border-top:1px solid #999">
  //          ${th}
  //       </tbody>
  //       </table></div>`,
  //       style: `font-size: 14px;text-align:center;`
  //     },
  //     {
  //       type: 'text',
  //       value: `Total: ${new CurrencyPipe('en-GB').transform(data.totalAmount, this.config.getAllConfig().company_currency)}`,
  //       style: `margin:25px 0 12px 0;padding: 10px 0;text-align:center;border-top:1px solid #999;border-bottom:1px solid #999;
  //       font-size: 17px;font-family:monospace, cursive;font-weight:bold`
  //     },
  //     {
  //       type: 'text',
  //       value: this.config.getAllConfig().print_message.toLowerCase(),
  //       style: `text-align:center;font-size: 11px;font-family:monospace, cursive;`
  //     },
  //     {
  //       type: 'text',
  //       value: '@' + this.config.getAllConfig().company_name,
  //       style: `text-align:center;font-size: 10px;font-family:monospace, cursive;`
  //     }
  //   ]);
  //   PosPrinter.print(print_data, {
  //     copies: 1,
  //     printerName: this.config.getAllConfig().printer_name,
  //     preview: true,
  //     width: '250px'
  //   }).then(() => {
  //     console.log('completed!');
  //   }).catch(err => {
  //     console.error(err);
  //   });
  // }
}
