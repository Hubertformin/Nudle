import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

import {MatSnackBar} from '@angular/material';
import {faBoxOpen, faChevronDown, faPencilAlt, faPlusCircle, faSearch, faSortAmountUp, faTrash} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import {SettingsService} from '../../../providers/settings.service';
import {DbService} from '../../../providers/db.service';
import {MenuCategoryModel, MenuItemModel, ItemModel, MenuItemEntity} from '../../../data-access/entities';
import {PromptPasswordService} from '../../../providers/prompt-password.service';
import {FixedSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY} from '@angular/cdk/scrolling';
import {AuthService} from '../../../providers/auth.service';
import {MatSelectChange} from '@angular/material/select';

// interface Ingredients {
//   name: string;
//   units: string;
//   quantity: string;
//   user_deleted: boolean;
//   item_id?: number;
//   inventory_id?: number;
//   ingredient_id?: number;
// }

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(50, 0, 0);
  }
}

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy }]
})
export class MenuItemsComponent implements OnInit, AfterViewInit, OnDestroy {
  modifyQtyIcon = faSortAmountUp;
  // toggle true, when querying db, so as to show loaders
  dbOperation = false;
  /**
   * @property actionForm
   */
  actionForm = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    category: [null],
    branch: [null],
    category_id: [null],
    unitPrice: [null, Validators.required],
    posCode: [null],
    stackable: [false],
    quantity: [null],
    inventory_id: [null],
    ingredient_quantity: [null],
    cookTime: [null],
    procedureDescription: [null]
  });
  /**
   *  Group form
   * */
  categoryForm = this.formBuilder.group({
    id: [null],
    name: [null]
  });
  /**
   * modify item's quantity form
   * */
  modifyItemsQuantityForm = this.formBuilder.group({
    id: [null],
    name: [null],
    initQuantity: [null],
    mode: ['1'],
    changeQuantity: [null]
  });

  updateItemIndex = new FormControl('');

  createIcon = faPlusCircle;
  editIcon = faPencilAlt;
  deleteIcon = faTrash;
  dropDownIcon = faChevronDown;
  menuItemIcon = faBoxOpen;
  searchIcon = faSearch;
  FORM_ACTION_CREATE: boolean;
  //
  menuCategories: MenuCategoryModel[];
  menuItems: MenuItemEntity[] = [];
  inventoryItems: ItemModel[];
  selectedInventoryItems: ItemModel[];
  CATEGORY_FORM_ACTION_CREATE: boolean;
  mItemsSearchResults: MenuItemEntity[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private config: SettingsService,
    private db: DbService,
    private passwordService: PromptPasswordService,
    private ref: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.selectedInventoryItems = [];
    this.menuCategories = [];

    this.FORM_ACTION_CREATE = true;
    // get all menu items
    // get all menu items
    this.db.getAllMenuItems()
      .then((data) => {
        this.menuItems = data;
        console.log(data);
      });
    // get all inventory items
  }
  /**
   * @method
   * @name ngAfterViewInit
   * Lift cycle hook, this method is called after the view has been initialized...
   * */
  ngAfterViewInit(): void {
    // get all menu categories
    this.db.getAllMenuCategories()
      .then((data) => {
        this.menuCategories = data;
        console.log(data);
      });
    // get all inventory items
    this.db.getAllInventoryItems()
      .then(data => this.inventoryItems = data);
  }

  // Form control getters
  get name() {
    return this.actionForm.get('name');
  }
  get unitPrice() {
    return this.actionForm.get('unitPrice');
  }
  get stackable() {
    return this.actionForm.get('stackable');
  }
  get category_name() {
    return this.categoryForm.get('name');
  }
  get current_user() {
    return this.auth.getAuthUser();
  }
  get currency() {
    return this.config.get('company_currency');
  }
  get authUser() {
    return this.auth.getAuthUser();
  }
  // when user clicks add inventory in form
  selectInventoryItem() {
    if (this.actionForm.get('inventory_id').value && this.actionForm.get('ingredient_quantity').value) {
      const item: ItemModel = this.inventoryItems.filter(el => {
        return el.id === this.actionForm.get('inventory_id').value;
      })[0];
      item.quantity = this.actionForm.get('ingredient_quantity').value;
      // pushing to selected array
      this.selectedInventoryItems.push(item);
      this.actionForm.patchValue({inventory_name: null, ingredient_quantity: null});
      console.log(item);
    } else {
      this.snackBar.open('Select inventory item and specify quantity', 'close', {duration: 2500});
    }
  }
  removeInventoryItem(index: number) {
    // this.selectedInventoryItems[index].user_deleted = true;
    this.selectedInventoryItems.splice(index, 1);
  }

  toggleModal(id) {
    $(id).fadeToggle('fast');
  }

  toggleUpdateMenuItemMode(index: number) {
    this.FORM_ACTION_CREATE = false;
    // patching form to values of selected row
    this.actionForm.patchValue(this.menuItems[index]);
    this.actionForm.patchValue({category_id: this.menuItems[index].category ? this.menuItems[index].category.id : null});
    this.selectedInventoryItems = (this.menuItems[index] as any).inventoryItems ? (this.menuItems[index] as any).inventoryItems : [];

    this.toggleModal('#createMenuItem');
  }

  toggleCreateMenuItemMode() {
    this.FORM_ACTION_CREATE = true;
    this.actionForm.reset();
    // this.actionForm.patchValue({branch: this.branches[0]});
    this.toggleModal('#createMenuItem');
  }
  /**
   * When the select menu category in menu item form*/
  onCategorySelect($event: MatSelectChange) {
    if ($event.value === 'createCategory') {
      this.toggleModal('#createMenuItem');
      this.toggleCategoryCreateMode();
      return;
    }
    const mCategory = this.menuCategories.filter((el) => el.id === $event.value)[0];
    this.actionForm.patchValue({category: mCategory});
  }
  /**
   * @method
   * @name createMenuItem
   * post form to backend
   * **/
  createMenuItem() {
    const mItem = this.actionForm.value;
    (mItem as any).inventoryItems = this.selectedInventoryItems;
    mItem.staff = this.current_user;
    // some validations
    if (!mItem.name) {
      this.snackBar.open('Menu Item name is required');
      return;
    }
    if (!mItem.unitPrice) {
      this.snackBar.open('The item\'s price is required');
      return;
    }
    if (!mItem.category.name) {
      this.snackBar.open('Please select a category');
      return;
    }
    // toggle db operations to true
    this.dbOperation = true;
    // add to database
    this.db.addMenuItem(mItem)
      .then(data => {
        // remove toggle
        this.dbOperation = false;
        // console.log(data);
        // mutate menu items array
        this.menuItems = [...this.menuItems, data];
        // manually detect changes in array
        this.ref.detectChanges();
        // close modal
        this.toggleModal('#createMenuItem');
        // display notification
        this.snackBar.open('Item created!', 'close', {duration: 2500});
      }).catch((e) => {
        if (e.toString().indexOf('.name') > -1) {
          this.snackBar.open(`'${mItem.name}' already exist`, '', {duration: 3500});
        }
        if (e.toString().indexOf('.posCode') > -1) {
          this.snackBar.open(`The posCode: '${mItem.posCode}' exist in another item`, '', {duration: 3500});
        }
        this.dbOperation = false;
      this.ref.detectChanges();
      });
  }
  /**
   * @method
   * @name updateMenuItem
   * post form to backend
   * **/
  updateMenuItem() {
    const mItem = this.actionForm.value;
    (mItem as any).inventoryItems = this.selectedInventoryItems;
    mItem.staff = this.current_user;
    // updates
    this.dbOperation = true;
    this.db.updateMenuItem(mItem)
      .then(data => {
        // toggle operation status
        this.dbOperation = false;
        // mutate array with updated value
        this.menuItems = this.menuItems.map(el => {
          if (el.id === data.id) {
            el = data;
          }
          return el;
        });
        this.ref.detectChanges();
        // close modal
        this.toggleModal('#createMenuItem');
        // display snackbar
        this.snackBar.open('Item updated!', 'close', {duration: 2500});
      }).catch((e) => {
      if (e.toString().indexOf('.name') > -1) {
        this.snackBar.open(`'${mItem.name}' already exist`, '', {duration: 3500});
      }
      if (e.toString().indexOf('.posCode') > -1) {
        this.snackBar.open(`The posCode: '${mItem.posCode}' exist in another item`, '', {duration: 3500});
      }
      this.dbOperation = false;
      this.ref.detectChanges();
    });
  }

  deleteMenuItem(id: number, index: number) {
    if (window.confirm('Are you sure?')) {
      this.db.deleteMenuItem(id)
        .then(() => {
          this.menuItems = this.menuItems.filter((_, i) => i !== index);
          this.ref.detectChanges();
        });
    }
  }

  menuItemFormAction() {
    if (this.FORM_ACTION_CREATE) {
      this.createMenuItem();
    } else {
      this.updateMenuItem();
    }
  }
  /**
   * @method
   * @name toggleItemQuantity
   * @description modify item quantity
   * */
  toggleItemQuantity(index: number) {
    const selected_item = this.menuItems[index];
    this.modifyItemsQuantityForm.patchValue({
      id: selected_item.id,
      name: selected_item.name,
      initQuantity: selected_item.quantity,
    });
    this.toggleModal('#modifyItemsQuantity');
  }
  /**
   * @method
   * @name modifyItemQuantity
   * @description modify item quantity
   * */
  modifyItemQuantity() {
    if (this.modifyItem_mode.value === '0' && this.modifyItem_initQuantity.value < this.modifyItem_changeQuantity.value) {
      this.snackBar.open('Failed to modify quantity.\n Attempting to deduct more than available.', 'close', {duration: 3800});
      return;
    }
    // tslint:disable-next-line:triple-equals
    const quantity = this.modifyItem_mode.value == '1' ?
      Number(this.modifyItem_initQuantity.value) + Number(this.modifyItem_changeQuantity.value) :
      Number(this.modifyItem_initQuantity.value - this.modifyItem_changeQuantity.value);
    // modifying quantity
    this.db.modifyQuantity(this.modifyItemsQuantityForm.get('id').value, quantity)
      .then(() => {
        this.toggleModal('#modifyItemsQuantity');
        // update item
        this.menuItems = this.menuItems.map(el => {
          if (el.id === this.modifyItemsQuantityForm.get('id').value) {
            el.quantity = quantity;
          }
          return el;
        });
        this.ref.detectChanges();
        // reset form
        this.modifyItemsQuantityForm.patchValue({id: null, name: null, initQuantity: null, mode: '1', changeQuantity: null});
      });
  }
  // getters
  get modifyItem_name() {
    return this.modifyItemsQuantityForm.get('name');
  }
  get modifyItem_initQuantity() {
    return this.modifyItemsQuantityForm.get('initQuantity');
  }
  get modifyItem_mode() {
    return this.modifyItemsQuantityForm.get('mode');
  }
  get modifyItem_changeQuantity() {
    return this.modifyItemsQuantityForm.get('changeQuantity');
  }

  // CATEGORY METHODS!!
  /**
   * @method
   * @name onSelectionChanged
   * @summary This method is fired when table rows get selected (checkbox clicked)
   **/
  toggleCategoryCreateMode() {
    this.CATEGORY_FORM_ACTION_CREATE = true;
    this.categoryForm.reset();
    this.toggleModal('#createMenuCategory');
  }

  toggleCategoryUpdateMode(index: number) {
    this.CATEGORY_FORM_ACTION_CREATE = false;
    this.categoryForm.patchValue({
      id: this.menuCategories[index].id,
      name: this.menuCategories[index].name
    });
    this.updateItemIndex.patchValue(index);
    this.toggleModal('#createMenuCategory');
  }

  categoryFormAction() {
    if (!this.category_name.value || this.category_name.value === '') {
      this.snackBar.open('Please insert a valid category name', 'close', {duration: 3000, horizontalPosition: 'right'});
      return;
    }
    // add or update
    if (this.CATEGORY_FORM_ACTION_CREATE === true) {
      this.db.addMenuCategory(this.categoryForm.value)
        .then(data => {
          this.menuCategories = [...this.menuCategories, data];
          // detect changes in array
          this.ref.detectChanges();
          // display message with a snackbar
          this.snackBar.open('Category created!', 'close', {duration: 3000, horizontalPosition: 'right'});
        });
    } else {
      // update menu categories
      this.db.updateMenuCategory(this.categoryForm.value)
        .then(data => {
          this.menuCategories = this.menuCategories.map(el => {
            if (el.id === data.id) {
              el = data;
            }
            return el;
          });
          // detect mutations on array
          this.ref.detectChanges();
          // display message with a snackbar
          this.snackBar.open('Category updated!', 'close', {duration: 3000, horizontalPosition: 'right'});
        });
    }
    // after create or update
    this.toggleModal('#createMenuCategory');
  }

  deleteCategory(id) {
    this.passwordService.openDialog('This would delete associated menu items')
      .subscribe((isConfirm) => {
        // delete category from database
        if (isConfirm) {
          this.db.deleteMenuCategory(id)
            .then(() => {
              this.menuCategories = this.menuCategories.filter(el => el.id !== id);
              this.ref.detectChanges();
            });
          this.snackBar.open('Category deleted', 'close', {duration: 2500, horizontalPosition: 'right'});
        } else {
          this.snackBar.open('Wrong password', 'close', {duration: 2500, horizontalPosition: 'right'});
        }
      });
  }

  ngOnDestroy(): void {
  }

  searchMenuItems() {
    const val = $('#searchInput').val().toLowerCase(), view = $('#searchMenuRes');
    // if not input
    if (val === '') {
      view.fadeOut('fast');
      return;
    }
    this.mItemsSearchResults = this.menuItems.filter((item, index) => {
      if (index > 10) { return; }
      if (item.name.toLowerCase().indexOf(val) > -1) { return true; }
      if (item.category) {
        if (item.category.name.toLowerCase().indexOf(val) > -1) { return true; }
      }
      if (item.unitPrice.toString().indexOf(val) > -1) { return true; }
      if (item.quantity) {
        if (item.quantity.toString().indexOf(val) > -1) { return true; }
      }
      return false;
    });
    view.fadeIn('fast');
  }
}
