import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';

import {
  faChevronDown, faExclamation,
  faPencilAlt,
  faPlusCircle, faSearch,
  faSortAmountUp,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import {MatSnackBar} from '@angular/material';
import {DbService} from '../../../providers/db.service';
import {ItemEntity, ItemModel, MenuItemModel, StorageAreaModel, SupplierModel} from '../../../data-access/entities';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {AuthService} from '../../../providers/auth.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, AfterViewInit {
  @ViewChild('storageAreasInput', {static: false}) storageAreasInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoComp1', {static: false}) storageAutocomplete: MatAutocomplete;
  // for suppliers
  @ViewChild('supplierInput', {static: false}) supplierInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoComp2', {static: false}) supplierAutocomplete: MatAutocomplete;
  /**
   * @property actionForm, reactive form object
   * */
  itemForm = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    quantity: [null, Validators.required],
    units: [null, Validators.required],
    unitCost: [null, Validators.required],
    storageAreas: this.formBuilder.array([]),
    suppliers: this.formBuilder.array([]),
    minOrderQuantity: [null]
  });
  /**
   * @property modify item quantity form
   * */
  itemQuantityForm = this.formBuilder.group({
    id: [null],
    name: [null],
    initQuantity: [null],
    mode: ['1'],
    changeQuantity: [null],
    units: [null]
  });
  // get name of item to be modified
  get modifyItemQuantityName() {
    return this.itemQuantityForm.get('name').value;
  }
  // get units of item to be modified
  get modifyItemQuantityUnits() {
    return this.itemQuantityForm.get('units').value;
  }
  /**
   * @property (boolean) FORM_ACTION_CREATE
   * Save the state of the form's action method, to for either create or update...
   * */
  FORM_ACTION_CREATE: boolean;
  /**
   * @property (number) UPDATE_INDEX
   * Save the index to the current item object about-config to be updated..
   * */
  UPDATE_INDEX: number;
  /**
   * @property createIcon: Importing the plus icon used in view..
   * @property editIcon
   * @property deleteIcon
   * @property menuManager: MenuManager object
   * @property inventoryItems: All inventory records from database.
   * */
  createIcon = faPlusCircle;
  editIcon = faPencilAlt;
  deleteIcon = faTrash;
  dropDownIcon = faChevronDown;
  cancelIcon = faTimesCircle;
  addQty = faSortAmountUp;
  warnIcon = faExclamation;
  searchIcon = faSearch;
  /**
   * Array of inventory items
   * */
  inventoryItems: any[];
  selectable = true;
  removable = true;
  addOnBlur = true;
  storageAreasInputCtrl = new FormControl(); // the auto-complete input control for storage areas
  supplierInputCtrl = new FormControl(); // the auto-complete input control for suppliers

  separatorKeysCodes: number[] = [ENTER, COMMA]; // importing keycodes form angular/cdk used by autocomplete chip

  filteredAreas: Observable<StorageAreaModel[]>;
  filteredSuppliers: Observable<SupplierModel[]>;

  selectedStorageAreas: StorageAreaModel[] = [];
  selectedSuppliers: SupplierModel[] = [];

  allStorageAreas: StorageAreaModel[] = [];
  allSuppliers: SupplierModel[] = [];
  inventorySearchResults: ItemEntity[] = [];


  constructor(private formBuilder: FormBuilder, private db: DbService,
              private snackBar: MatSnackBar, private ref: ChangeDetectorRef, private authService: AuthService) {
    // filer storage autocomplete results as user types
    this.filteredAreas = this.storageAreasInputCtrl.valueChanges.pipe(
      startWith(null),
      map((storageAreas: string | null) => storageAreas ? this._filterAreas(storageAreas) : this.allStorageAreas.slice()));

    // filer supplier autocomplete results as user types
    this.filteredSuppliers = this.supplierInputCtrl.valueChanges.pipe(
      startWith(null),
      map((suppliers: string | null) => suppliers ? this._filterSuppliers(suppliers) : this.allSuppliers.slice()));
  }
  /**
   * @method
   * @summary Getters for form methods from the reactive form, to be used for validation
   */
  get name() {
    return this.itemForm.get('name');
  }
  get quantity() {
    return this.itemForm.get('quantity');
  }
  get units() {
    return this.itemForm.get('units');
  }
  get unitPrice() {
    return this.itemForm.get('unitCost');
  }
  // getters form quantity form
  get modify_index() {
    return this.itemQuantityForm.get('index');
  }
  get modified_quantity() {
    return this.itemQuantityForm.get('quantity');
  }
  get modify_mode() {
    return this.itemQuantityForm.get('mode');
  }
  get authUser() {
    return this.authService.getAuthUser();
  }

  // get all records from database
  private getAllRecords() {
    // get inventory
    this.db.getAllInventoryItems()
      .then((rows) => {
        // specifying it's not of type MenuItems
        this.inventoryItems = (this.inventoryItems as ItemModel[]).concat(rows);
        console.log(this.inventoryItems);
      });
    this.db.getAllMenuItems()
      .then((rows: any[]) => {
        // specifying it's not of type MenuItems
        this.inventoryItems = (this.inventoryItems as any[]).concat(rows.filter(row => row.stackable));
        // sort array
        this.inventoryItems = this.inventoryItems.sort((a, b) => a.name.localeCompare(b.name) ? 1 : ((b.name.localeCompare(a.name)) ? -1 : 0));
      });
  }

  ngOnInit() {
    this.inventoryItems = [];

    this.FORM_ACTION_CREATE = true; // Form action create...
    // get all records from database
    this.getAllRecords();
  }

  ngAfterViewInit(): void {
    // get all storage areas
    this.db.getAllStorageAreas()
      .then(data => {
        this.allStorageAreas = data;
      });
    // get all suppliers
    this.db.getAllSuppliers()
      .then(data => {
        this.allSuppliers = data;
      });
  }

  /**
   * @method
   * @name toggleCreateItemModal
   * open the modal containing form to create or update an item object..
   * */
  toggleCreateItemModal() {
    $('#createInventoryItem').slideToggle('fast');
  }
  /**
   * @method
   * @name toggleCreateMode
   * toggle modal form's state to create
   * */
  toggleCreateMode() {
    this.FORM_ACTION_CREATE = true;
    this.itemForm.reset(); // reseting form
    this.selectedSuppliers = []; // reset select autocomplete suppliers
    this.selectedStorageAreas = []; // reset select autocomplete storage areas
    this.toggleCreateItemModal();
  }
  /**
   * @method
   * @name toggleUpdateMode
   * toggle modal form's state to update, by patching form and storage and suppliers array object..
   * */
  toggleUpdateMode(index: number) {
    if (!(this.inventoryItems[index] as any).stackable) {
      this.FORM_ACTION_CREATE = false;
      this.UPDATE_INDEX = index; // to be used to update this.inventoryItems array
      this.itemForm.patchValue(this.inventoryItems[index]); //  patching form
      // patch selected suppliers and storage areas, to show on form
      this.selectedStorageAreas = (this.inventoryItems[index] as ItemEntity).storageAreaConnection.map(st => st.storageArea);
      this.selectedSuppliers = (this.inventoryItems[index] as ItemEntity).supplierConnection.map(it => it.supplier);
      this.toggleCreateItemModal(); // open modal
    }
  }
  /**
   * @method
   * @name createInventoryItem
   * @summary Add inventory item to database...
   * */
  createInventoryItem() {
    // adding to database
    this.db.addInventoryItem(this.itemForm.value)
      .then((data) => {
        (this.inventoryItems as ItemModel[]).push(data);
        /*
         if storage areas and supplier array are empty, pass current object's
         This is in the case on the first creation...
         */
        if (this.allStorageAreas.length === 0 && data.storageAreaConnection.length > 0) {
          this.allStorageAreas = data.storageAreaConnection.map(st => st.storageArea);
        }
        if (this.allSuppliers.length === 0 && data.supplierConnection.length > 0) {
          this.allSuppliers = data.supplierConnection.map(sp => sp.supplier);
        }
        this.toggleCreateItemModal();
      }).catch(err => {
        console.error(err);
        if (err.indexOf('item.name') > -1) {
          this.snackBar.open('This item by name already exist', 'close', {duration: 3500, horizontalPosition: 'end'});
        } else {
          this.snackBar.open('Unable to add item to list.', 'close', {duration: 3500, horizontalPosition: 'end'});
        }
    });
  }
  /**
   * @method
   * @name deleteInventoryItem
   * */
  updateInventoryItem(object: any) {
    // update inventory
    if (!object.stackable) {
      this.db.updateInventoryItem(object)
        .then((data) => {
          this.inventoryItems[this.UPDATE_INDEX] = data;
          console.log(data);
          this.UPDATE_INDEX = null;
          this.toggleCreateItemModal();
        });
    }
  }
  /**
   * @method
   * @name deleteInventoryItem
   * @summary delete inventory item from database...
   * */
  deleteInventoryItem(id: number, index: number) {
    if (window.confirm('Are you sure?') && !(this.inventoryItems[index] as any).stackable) {
      this.db.deleteInventoryItem(id)
        .then(() => {
          (this.inventoryItems as any[]).splice(index, 1);
          this.snackBar.open('Item deleted', 'close', {duration: 2500});
        });
    }
  }

  formAction() {
    if (this.itemForm.invalid) {
      this.snackBar.open('You form is invalid', 'close', {
        duration: 2500
      });
      return;
    }
    const storage_control = <FormArray>this.itemForm.controls.storageAreas; // getting form array variable from reactive
    const supplier_control = <FormArray>this.itemForm.controls.suppliers;

    storage_control.clear(); // resetting array
    supplier_control.clear();
    // pushing chips of the selected arrays to form data
    this.selectedStorageAreas.forEach(x => {
      storage_control.push(this.formBuilder.group(x));
    });
    this.selectedSuppliers.forEach(x => {
      supplier_control.push(this.formBuilder.group(x));
    });

    if (this.FORM_ACTION_CREATE) {
      this.createInventoryItem();
    } else {
      this.updateInventoryItem(this.itemForm.value);
    }
  }

  /**
   *  ==================== AUTO COMPLETE METHODS ==============
   *  1. STORAGE AREA AUTOCOMPLETE METHODS
   * */
  addStorageArea(event: MatChipInputEvent): void {
    // Add storage area only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.storageAutocomplete.isOpen) {
      const input = event.input, value = event.value;
      let _fa = [];

      // Add storage area
      if ((value || '').trim()) {
        _fa = this.allStorageAreas.filter(el => el.name.toLowerCase() === value.toLowerCase());
        if (_fa.length > 0) {
          this.selectedStorageAreas.push(_fa[0]);
        } else {
          this.selectedStorageAreas.push({id: null, name: value, description: ''});
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.storageAreasInputCtrl.setValue(null);
    }
  }

  removeStorageArea(index: number): void {
    if (index >= 0) {
      this.selectedStorageAreas.splice(index, 1);
    }
  }

  selectedStorageArea(event: MatAutocompleteSelectedEvent): void {
    this.selectedStorageAreas.push(event.option.value);
    this.storageAreasInput.nativeElement.value = '';
    this.storageAreasInputCtrl.setValue(null);
  }

  private _filterAreas(value): StorageAreaModel[] {
    const filterValue = typeof value === 'object' ? value.name.toLowerCase() : value.toLowerCase();
    return this.allStorageAreas.filter(storageArea => storageArea.name.toLowerCase().indexOf(filterValue) === 0);
  }
  /**
   *  ==================== AUTO COMPLETE METHODS ==============
   *  1. STORAGE AREA AUTOCOMPLETE METHODS
   * */
  addSupplier(event: MatChipInputEvent): void {
    // Add supplier only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.supplierAutocomplete.isOpen) {
      const input = event.input, value = event.value;
      let _fa = [];

      // Add storage area
      if ((value || '').trim()) {
        _fa = this.allSuppliers.filter(el => el.name.toLowerCase() === value.toLowerCase());
        if (_fa.length > 0) {
          this.selectedSuppliers.push(_fa[0]);
        } else {
          this.selectedSuppliers.push({id: null, name: value, description: ''});
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.supplierInputCtrl.setValue(null);
    }
  }

  removeSupplier(index: number): void {
    if (index >= 0) {
      this.selectedSuppliers.splice(index, 1);
    }
  }

  selectedSupplier (event: MatAutocompleteSelectedEvent): void {
    this.selectedSuppliers.push(event.option.value);
    this.supplierInput.nativeElement.value = '';
    this.supplierInputCtrl.setValue(null);
  }

  private _filterSuppliers(value): SupplierModel[] {
    const filterValue = typeof value === 'object' ? value.name.toLowerCase() : value.toLowerCase();
    return this.allSuppliers.filter(supplier => supplier.name.toLowerCase().indexOf(filterValue) === 0);
  }
  /**
   *  ==================== MODIFY QUANTITY FORM ============
   * */
  toggleModal(el) {
    $(el).fadeToggle('fast');
  }

  toggleModifyQtyModal(index?: number) {
    this.itemQuantityForm.patchValue({
      id: this.inventoryItems[index].id,
      name: this.inventoryItems[index].name,
      units: this.inventoryItems[index].units,
      initQuantity: this.inventoryItems[index].quantity
    });
    this.toggleModal('#modifyItemQty');
  }
  // modify item quantity
  alterItemQty(menuType = false) {
    // if inventory type
    if (!menuType) {
      // get data
      const id = this.itemQuantityForm.get('id').value, mode = this.itemQuantityForm.get('mode').value,
        init_quantity = this.itemQuantityForm.get('initQuantity').value, modified_quantity = this.itemQuantityForm.get('changeQuantity').value;
      // return if user is attempting to deduct more quantity than available;
      // tslint:disable-next-line:triple-equals
      if (mode == '0' && init_quantity < modified_quantity) {
        this.snackBar.open('Error: Attempting to deduct more than availble', 'close', {duration: 3800});
        return;
      }
      // tslint:disable-next-line:triple-equals
      const new_quantity = mode == '1' ? Number(init_quantity) + Number(modified_quantity) : Number(init_quantity) - Number(modified_quantity);
      // update item
      this.db.modifyInventoryQuantity(id, new_quantity)
        .then((data) => {
          // close modal
          this.toggleModal('#modifyItemQty');
          // update array..
          this.inventoryItems = (this.inventoryItems as ItemModel[]).map(it => {
            // update if its not a menu items
            if (it.id === id && it instanceof ItemEntity) {
              it.quantity = new_quantity;
            }
            return it;
          });
          this.ref.detectChanges(); // detect changes
          // reset form
          this.itemQuantityForm.reset({mode: '1'});
        })
        .catch(err => {
          console.error(err);
          this.snackBar.open('Error: Unable to modify item\'s quantity.', 'close', {duration: 2500});
        });
    }
  }

  searchInventory() {
    const searchVal = $('#searchInput').val().toLowerCase();
    const view = $('#searchInvRes');
    if (searchVal === '') {
      view.fadeOut('fast');
      return;
    }
    this.inventorySearchResults = this.inventoryItems.filter((item, index) => {
      // taking 10 results
      if (index > 10) { return false; }
      if (item.name.toLowerCase().indexOf(searchVal) > -1) { return true; }
      if (item.units) {
        if (item.units.toLowerCase().indexOf(searchVal) > -1) { return true; }
      }
      if (item.unitPrice) {
        if (item.unitPrice.toString().indexOf(searchVal) > -1) { return true; }
      }
      if (item.quantity) {
        if (item.quantity.toString().indexOf(searchVal) > -1) { return true; }
      }
      return false;
    });
    // show view
    view.fadeIn('fast');
  }
}
