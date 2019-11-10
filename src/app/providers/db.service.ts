import { Injectable } from '@angular/core';
import {
    ExpenseModel,
    MenuCategoryEntity,
    MenuItemEntity,
    SaleCounterModel,
    SaleEntity,
    StaffModel,
    SaleModel,
    StaffEntity,
    StaffGroupEntity,
    WasteEventEntity,
    SaleCounterEntity,
    SaleMenuItem,
    ExpenseEntity,
    IngredientEntity,
    ItemEntity,
    ItemToStorageArea,
    ItemToSupplier,
    MenuItemReportEntity,
    MenuCategoryReportsEntity,
    ReportsEntity,
    SupplierEntity,
    StorageAreaEntity,
    UserPermissions
} from '../data-access/entities';
import {DomSanitizer} from '@angular/platform-browser';
import {Between, Connection, ConnectionOptions, createConnection, FindManyOptions, FindOneOptions, Like} from 'typeorm';
import {Directories} from '../../../api/modules/directories-module';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material';
import {SaleSubscriber} from '../data-access/subscriber/sale.subscriber';
import {ExpenseSubscriber} from '../data-access/subscriber/expense.subscriber';
import {MenuSaleSubscriber} from '../data-access/subscriber/menu-sale.subscriber';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;
  private _date: Date;
  constructor() {
    // init date
    this._date = new Date();
    this._date.setHours(0, 0, 0, 0);
    // database connection options
    this.options = {
        type: 'sqlite',
        database: Directories.DATABASE_PATH,
        entities: [
            StaffGroupEntity,
            StaffEntity,
            MenuCategoryEntity,
            MenuItemEntity,
            SaleEntity,
            WasteEventEntity,
            SaleCounterEntity,
            ExpenseEntity,
            ItemEntity,
            StorageAreaEntity,
            SupplierEntity,
            IngredientEntity,
            ItemToStorageArea,
            ItemToSupplier,
            MenuItemReportEntity,
            ReportsEntity,
            MenuCategoryReportsEntity,
            SaleMenuItem
      ],
        subscribers: [SaleSubscriber, ExpenseSubscriber, MenuSaleSubscriber],
        synchronize: true,
        logging: 'all',
    };
    this.connection = createConnection(this.options)
        .then<Connection>((con: Connection) => {
            // report data
            con.manager.createQueryBuilder()
                .insert()
                .into(ReportsEntity)
                .values({id: 1, grossProfits: 0, totalExpenses: 0, averageDailySales: 0, dateId: 'GLOBAL'})
                .onConflict(`("id") DO NOTHING`)
                .execute()
                .catch(err => {
                    console.error(err);
                });
            // insert default count
            con.manager.createQueryBuilder()
                .insert()
                .into(SaleCounterEntity)
                .values({id: 1, count: 1})
                .onConflict(`("id") DO NOTHING`)
                .execute()
                .catch(err => {
                    console.error(err);
                });
            // insert admin role by default
            StaffGroupEntity.createQueryBuilder()
                .insert()
                // .into(StaffGroupEntity)
                .values({isRoot: true, permissions: new UserPermissions(true), name: 'Admin'})
                .onConflict(`("id") DO NOTHING`)
                .execute()
                .catch(err => {
                    console.error(err);
                });
            return con;
        });
  }
  /**
   * =======================================================
   * =================== BRANCH METHODS ==============
   * =======================================================
   */
  /*getBranches(): Promise<BranchModel[]> {
    return this.connection
        .then()
  }*/
  /*addBranch(data) {
  }*/
  /**
   * =======================================================
   * =================== STAFF METHODS ==============
   * =======================================================
   */
  /**
   * @method
   * @name authenticate
   * @description authenticate staff
   *
   *
   * */
  authenticate(username: string, password: string): Promise<StaffEntity> {
    return this.connection
        .then<StaffEntity>((con: Connection) => {
            /*const options: FindManyOptions<StaffEntity> = {
                relations: ['group'],
                where: [
                    {userName: username, password: password},
                    {email: username, password: password}
                ]
            };
          return con.manager.find(StaffEntity, options);*/
          return StaffEntity.createQueryBuilder('staff')
              .leftJoinAndSelect('staff.group', 'group')
              .where([{userName: username, password: password}, {email: username, password: password}])
              .getOne();
        });
  }
  /**
   * @method
   * @name addStaff
   * @description add staff to database
   *
   *
   * */
  addStaff(staffData: object): Promise<StaffEntity> {
    // return this.httpClient.post(this.DB_URL + 'staff', JSON.stringify(staffData), {headers: this.headers});
    return this.connection
        .then<StaffEntity>(() => {
          return StaffEntity.create(staffData).save();
        });
  }
  /**
   * @method
   * @name getAllStaff
   * @description get staff from database
   *
   *
   * */
  getAllStaff(): Promise<StaffEntity[]> {
    return this.connection
        .then<StaffEntity[]>(() => {
            const options: FindManyOptions<StaffEntity> = {relations: ['group']};
            return StaffEntity.find(options);
        });
  }
  // get specific staff
  getStaff(id: number): Promise<StaffEntity> {
    return this.connection
        .then<StaffEntity>(() => {
            const options: FindOneOptions<StaffEntity> = {relations: ['group']};
            return StaffEntity.findOne(id, options);
        });
  }
  // get staff activity...
  getStaffActivity(id: number): Promise<StaffEntity> {
    const options: FindManyOptions<StaffEntity> = {
      relations: ['group', 'receivedSales', 'receivedSales.cashier']
    };
    /**
     * Get database connection with getConnection
     * **/
    return this.connection
        .then<StaffEntity>(() => {
          return StaffEntity.findOne(id, options);
        });
  }
  // update staff
  updateStaff(staffData: any): Promise<StaffModel> {
    return this.addStaff(staffData);
  }
  // delete staff
  deleteStaff(id: any): Promise<any> {
    return this.connection
        .then(() => {
          return StaffEntity.delete(id);
        });
  }
  /**
   * =======================================================
   * =================== Group METHODS ==============
   * =======================================================
  */
  addStaffGroup(groupData: object): Promise<StaffGroupEntity> {
    return this.connection
        .then<StaffGroupEntity>(() => {
          return StaffGroupEntity.create(groupData).save();
        });
  }
  // get staff groups
  getAllStaffGroups(): Promise<StaffGroupEntity[]> {
    return this.connection
        .then<StaffGroupEntity[]>(() => {
          return StaffGroupEntity.find();
        });
  }
  getStaffGroup(id: number): Promise<StaffGroupEntity> {
    return this.connection
        .then<StaffGroupEntity>(() => {
          return StaffGroupEntity.findOne(id);
        });
  }
  // update staff group
  updateStaffGroup(groupData: any): Promise<StaffGroupEntity> {
    return this.addStaffGroup(groupData);
  }
  // delete staff
  deleteStaffGroup(id: number): Promise<any> {
    return this.connection
        .then(() => {
          return StaffGroupEntity.delete(id);
        });
  }
  /**
   * =======================================================
   * =================== MENU CATEGORY METHODS ==============
   * =======================================================
   */
  getAllMenuCategories(): Promise<MenuCategoryEntity[]> {
    return this.connection
        .then<MenuCategoryEntity[]>(() => {
          return MenuCategoryEntity.find();
        });
  }
  getMenuCategory(id: number): Promise<MenuCategoryEntity> {
    return this.connection
        .then<MenuCategoryEntity>(() => {
          return MenuCategoryEntity.findOne(id);
        });
  }
  addMenuCategory(mCategory: object): Promise<MenuCategoryEntity> {
    return this.connection
        .then<MenuCategoryEntity>(() => {
          return MenuCategoryEntity.create(mCategory).save();
        });
  }
  updateMenuCategory(mCategory: any): Promise<MenuCategoryEntity> {
    return this.addMenuCategory(mCategory);
  }
  deleteMenuCategory(id: number): Promise<any> {
    return this.connection
        .then(() => {
          return MenuCategoryEntity.delete(id);
        });
  }
  /**
   * =======================================================
   * =================== MENU ITEMS METHODS ==============
   * =======================================================
   */
  getAllMenuItems(): Promise<MenuItemEntity[]> {
    return this.connection
        .then<MenuItemEntity[]>(() => {
            const options: FindManyOptions<MenuItemEntity> = {relations: ['category', 'staff']};
            return MenuItemEntity.find(options);
        });
  }
  getMenuItem(id: number): Promise<MenuItemEntity> {
    return this.connection
        .then<MenuItemEntity>(() => {
            const options: FindOneOptions<MenuItemEntity> = {relations: ['category', 'staff']};
            return MenuItemEntity.findOne(id, options);
        });
  }
  addMenuItem(mItem: object): Promise<MenuItemEntity> {
    return this.connection
        .then<MenuItemEntity>(() => {
          return MenuItemEntity.create(mItem).save();
        });
  }
  updateMenuItem(mItem: any): Promise<MenuItemEntity> {
    return this.addMenuItem(mItem);
  }
  deleteMenuItem(id: number): Promise<any> {
    return this.connection
        .then(() => {
          return MenuItemEntity.delete(id);
        });
  }
  // search menutiems
  searchMenuItems(item: string, offset?: number, stackable?: boolean): Promise<MenuItemEntity[]> {
    return this.connection
        .then<MenuItemEntity[]>(() => {
            const options: FindManyOptions<MenuItemEntity> = {
                relations: ['category', 'ingredients', 'ingredients.item', 'staff'],
                cache: true,
                order: {name: 'ASC'}
            };
            if (offset) {
                options.where = [
                    {name: Like(`%${item}%`)},
                    {posCode: Like(`%${item}%`)}
                ];
                if (stackable === false || stackable === true) {
                    options.where.push({
                        stackable: stackable
                    });
                }
                options.take = offset;
            }
            return MenuItemEntity.find(options);
        });
  }
  /**
   * @method
   * @name modifyQuantity
   * @description modify menu item's quantity
   * */
  modifyQuantity(id: number, quantity: number): Promise<any> {
    return this.connection
        .then(() => {
          return MenuItemEntity.createQueryBuilder()
              .update()
              .set({ quantity:  quantity})
              .where('id = :id', { id: id })
              .execute();
        });
  }
  /**
   * =======================================================
   * =================== INVENTORY ITEMS METHODS ==============
   * =======================================================
   */
  getAllInventoryItems(): Promise<ItemEntity[]> {
    return this.connection
        .then<ItemEntity[]>(() => {
            const options: FindManyOptions<ItemEntity> = {
                relations: ['storageAreaConnection', 'storageAreaConnection.storageArea', 'supplierConnection', 'supplierConnection.supplier']
            };
          return ItemEntity.find(options);
        });
  }
  getInventoryItem(id: number): Promise<ItemEntity> {
    return this.connection
        .then<ItemEntity>(() => {
            const options: FindOneOptions<ItemEntity> = {
                relations: ['storageAreaConnection', 'storageAreaConnection.storageArea', 'supplierConnection', 'supplierConnection.supplier']
            };
          return ItemEntity.findOne(id, options);
        });
  }
  addInventoryItem(item: any): Promise<ItemEntity> {
    return this.connection
        .then<ItemEntity>(async() => {
          const ItemData = await ItemEntity.create(item).save();
            // initialize storage areas array for push...
            ItemData.storageAreaConnection = [];
            ItemData.supplierConnection = [];
            // get and save storage areas from request data to database
            for (let i = 0; i < item.storageAreas.length; i++) {
                const item_storage = new ItemToStorageArea(),
                    storage_area = new StorageAreaEntity();

                storage_area.id = item.storageAreas[i].id;
                storage_area.name = item.storageAreas[i].name;
                storage_area.description = item.storageAreas[i].description;
                // save the storage area, if it doesn't exist
                if (!item.storageAreas[i].id) {
                    await storage_area.save();
                }
                // assigning the storage areas to intermediary table
                item_storage.itemId = ItemData.id;
                item_storage.storageAreaId = storage_area.id;
                item_storage.storageArea = storage_area;
                await item_storage.save();

                // adding it to item
                ItemData.storageAreaConnection.push(item_storage);
            }

            // get and save supplier from request data to database
            for (let i = 0; i < item.suppliers.length; i++) {
                const item_supplier = new ItemToSupplier(),
                    supplier_ety = new SupplierEntity();

                supplier_ety.id = item.suppliers[i].id;
                supplier_ety.name = item.suppliers[i].name;
                supplier_ety.description = item.suppliers[i].description;
                // save the supplier, if it doesn't exist
                if (!item.suppliers[i].id) {
                    await supplier_ety.save();
                }
                // assigning the storage areas to intermediary table
                item_supplier.itemId = ItemData.id;
                item_supplier.supplierId = supplier_ety.id;
                item_supplier.supplier = supplier_ety;
                await item_supplier.save();

                // adding it to item
                ItemData.supplierConnection.push(item_supplier);
            }
            // send data
            return ItemData;
        });
  }
  /**
   * @method
   * @name updateInventoryItem
   * @param item
   * @description update inventory item
   * */
  updateInventoryItem(item: any): Promise<ItemEntity> {
    return this.addInventoryItem(item);
  }
  /**
   * @method
   * @name deleteInventoryItem
   * @description delete inventory item
   * */
  deleteInventoryItem(id: number): Promise<any> {
    return this.connection
        .then(() => {
          return ItemEntity.delete(id);
        });
  }
  /**
   * @method
   * @name searchInventory
   * */
  searchInventory(val: string, offset?: number): Promise<ItemEntity[]> {
      return this.connection
          .then<ItemEntity[]>(() => {
              const options: FindManyOptions<ItemEntity> = {
                  relations: ['storageAreaConnection', 'storageAreaConnection.storageArea', 'supplierConnection', 'supplierConnection.supplier'],
                  cache: true,
                  order: {name: 'ASC'}
              };
              if (val.toString().length >  0) {
                  options.where = [{name: Like(`%${val}%`)}, {unitCost: Like(`%${val}%`)}, {units: Like(`%${val}%`)}];
              }
              if (offset) {
                  options.take = offset;
              }
              return ItemEntity.find(options);
          });
  }
  /**
   * =======================================================
   * =================== STORAGE AREAS ==============
   * =======================================================
   */
  /**
   * @method
   * @name getAllStorageAreas
   * @description get all storage areas
   * */
  getAllStorageAreas(): Promise<StorageAreaEntity[]> {
    return this.connection
        .then<StorageAreaEntity[]>(() => {
          return StorageAreaEntity.find();
        });
  }
  /**
   * @method
   * @name modifyInventoryQuantity
   * @param id
   * @param quantity
   * */
  modifyInventoryQuantity(id: number, quantity: number) {
    return this.connection
        .then(() => {
          return ItemEntity.createQueryBuilder()
              .update()
              .set({ quantity:  quantity})
              .where('id = :id', { id: id })
              .execute();
        });
  }
  /**
   * =======================================================
   * =================== SUPPLIER ==============
   * =======================================================
   */
  /**
   * @method
   * @name getAllSuppliers
   * @description get all suppliers
   * */
  getAllSuppliers(): Promise<SupplierEntity[]> {
    return this.connection
        .then<SupplierEntity[]>(() => {
          return SupplierEntity.find();
        });
  }
  /**
   * =======================================================
   * =================== SALE ==============
   * =======================================================
   */
  /**
   * @method
   * @name getAllSale
   * @description get all sales objects
   * */
  getAllSale(): Promise<SaleEntity[]> {
    return this.connection
        .then<SaleEntity[]>(() => {
          const options: FindManyOptions<SaleEntity> = {
            relations: ['cashier', 'waiter', 'menuItemConnection', 'menuItemConnection.menuItem']
          };
          return SaleEntity.find(options);
        });
  }
  /**
   * @method
   * @name getSale
   * @param id
   * @description get sale by Id
   * */
  getSale(id: number): Promise<SaleEntity> {
    return this.connection
        .then<SaleEntity>(() => {
          const options: FindOneOptions<SaleEntity> = {
            relations: ['cashier', 'waiter', 'menuItemConnection', 'menuItemConnection.menuItem']
          };
          return SaleEntity.findOne(id, options);
        });
  }
  /**
   * @method
   * @name getSaleByDate
   * @description get all sale object in a specific date
   * */
  getSaleByDate(date: string): Promise<SaleModel[]> {
    return this.connection
        .then<SaleEntity[]>(() => {
          let whereClause;

          switch (date) {
            case 'today':

              const today = moment().format().split('T')[0];
              whereClause = Like(today + '%');
              break;
            case 'yesterday':
              const yesterday = moment().subtract(1, 'days').format().split('T')[0];
              whereClause = Like( yesterday + '%');
              break;
            case 'this-week':

              const day = this._date.getDay() > 0 ? this._date.getDay() - 1 : 6;
              let start_0 = moment().subtract(day, 'days').format('YYYY-MM-DD');
              let end_0 = moment().format('YYYY-MM-DD');
              // settings the time on dates
              start_0 += ' 00:00:00';
              end_0 += ' 23:59:00';
              whereClause = Between(start_0, end_0); // where clause between start of week and today
              break;
            case 'this-month':

              const day1 = this._date.getDate() - 1;
              let start_1 = moment().subtract(day1, 'days').format('YYYY-MM-DD');
              let end_1 = moment().format('YYYY-MM-DD');
              // settings the time on dates
              start_1 += ' 00:00:00';
              end_1 += ' 23:59:00';

              whereClause = Between(start_1, end_1);
              break;
          }
          const options: FindManyOptions<SaleEntity> = {
            relations: ['cashier', 'waiter', 'menuItemConnection', 'menuItemConnection.menuItem'],
            where: {createdAt: whereClause},
            order: {id: 'DESC'}
          };
          // get storage
          return SaleEntity.find(options);
        });
  }
  /**
   * @method
   * @name getSaleByDateRange
   * @description get sales objects in the interval specified
   * */
  getSaleByDateRange(start: string , end: string): Promise<SaleEntity[]> {
    return this.connection
        .then<SaleEntity[]>(() => {
          let startDate = moment(start).format('YYYY-MM-DD');
          let endDate = moment(end).format('YYYY-MM-DD');
          // ===========
          startDate += ' 00:00:00';
          endDate += ' 23:00:00';

          const options: FindManyOptions<SaleEntity> = {
            relations: ['cashier', 'waiter', 'menuItemConnection', 'menuItemConnection.menuItem'],
            where: {createdAt: Between(startDate, endDate)},
            order: {id: 'DESC'}
          };
          // get storage
          return SaleEntity.find(options);
        });
  }
  /**
   * @method
   * @name searchSale
   * @param query
   * @description search sales database
   * */
  searchSale(query: any): Promise<SaleEntity[]> {
    return this.connection
        .then<SaleEntity[]>(() => {
          const options: FindManyOptions<SaleEntity> = {
            relations: ['cashier', 'waiter', 'menuItemConnection', 'menuItemConnection.menuItem'],
            where: {
              invoiceNumber: Like(`%${query}%`),
              totalAmount: Like(`%${query}%`)
            },
            order: {id: 'DESC'}
          };
          // get storage
          return SaleEntity.find(options);
        });
  }
  /**
   * @method
   * @name addSale
   * @param sale: Sale object
   * @description add to sales
   * */
  addSale(sale: any): Promise<SaleEntity> {
    return this.connection
        .then(async() => {
          const _sale = await SaleEntity.create({
            invoiceNumber: sale.invoiceNumber,
            cashier: sale.cashier,
            waiter: sale.waiter,
            discount: sale.discount,
            tableId: sale.tableId,
            totalAmount: sale.totalAmount,
            completed: sale.completed
          }).save();

          // saving menu items-sale relations
          for (const menuItem of sale.menuItems) {

            await SaleMenuItem.create({
              menuItemId: menuItem.id,
              saleId: _sale.id,
              orderQuantity: menuItem.orderQuantity,
              amount: menuItem.orderQuantity * menuItem.unitPrice,
              menuItem: menuItem,
              sale: _sale
            }).save().then(() => {
              // decrease quantity in stock
              const new_quantity = menuItem.stackable ? Number(menuItem.quantity) - Number(menuItem.orderQuantity) : null;
              if (menuItem.stackable && new_quantity >= 0) {
                MenuItemEntity.createQueryBuilder()
                    .update()
                    .set({ quantity: new_quantity})
                    .where('id = :id', { id: menuItem.id })
                    .execute()
                    .catch(err => console.error(err));

              }
            }).catch(err => {});
          }
          // print order
          /*if (sale.printOrder) {
            PrinterAction.printSale(sale)
                .catch(err => {
                  console.error(err);
                  this.snackBar.open('Unable printing, check if printer is connected', 'close',
                      {duration: 2500, horizontalPosition: 'end', verticalPosition: 'bottom'});
                });
          }*/

          return _sale;
        });
  }
  /**
   * @method
   * @name deleteSale
   * @param id
   * @description delete sale item
   *
   *
   * */
  deleteSale(id: number): Promise<any> {
    return this.connection
        .then(() => {
          return SaleEntity.delete(id);
        });
  }
  /**
   * @method
   * @name toggleSaleStatus
   * @param id
   * @param status
   * @description toggle sale status to paid or unpaid
   *
   *
   * */
  toggleSaleStatus(id: number, status: boolean): Promise<any> {
    return this.connection
        .then(() => {
          return SaleEntity.createQueryBuilder()
              .update()
              .set({ completed: status })
              .where('id = :id', { id: id })
              .execute();
        });
  }
  /**
   * @method
   * @name addDefaultSaleCount
   * @description add default sale count
   *
   *
   * */
  addDefaultSaleCount(): Promise<any> {
      return SaleCounterEntity.insert({
          id: 1,
          count: 1
      });
  }
  /**
   * @method
   * @name getSaleCount
   * @description get sale count
   *
   *
   * */
  getSaleCount(): Promise<SaleCounterModel> {
    return SaleCounterEntity.findOne(1)
        .then<SaleCounterEntity>(async (data) => {
          // if the current date is not equal to the last date the counter was updated, reset counter..
          if (new Date(data.updatedAt).toDateString() !== new Date().toDateString()) {
            await SaleCounterEntity.update(1, {count: 1});
            data.count = 1;
          }
          return data;
        });
  }
  /**
   * =======================================================
   * =================== EXPENSE ==============
   * =======================================================
   */
  /**
   * @method
   * @name getAllExpenses
   * @description get all expenses objects
   * */
  getAllExpenses(): Promise<ExpenseEntity[]> {
    return this.connection
        .then<ExpenseEntity[]>(() => {
            const options: FindManyOptions<ExpenseEntity> = {relations: ['staff']};
          return ExpenseEntity.find(options);
        });
  }
  /**
   * @method
   * @name getExpense
   * @param id
   * @description get expense by Id
   * */
  getExpense(id: number): Promise<ExpenseEntity> {
    return this.connection
        .then<ExpenseEntity>(() => {
            const options: FindOneOptions<ExpenseEntity> = {relations: ['staff']};
          return ExpenseEntity.findOne(id, options);
        });
  }
  /**
   * @method
   * @name getSaleByDate
   * @description get all sale object in a specific date
   * */
  getExpenseByDate(date: string): Promise<ExpenseEntity[]> {
    return this.connection
        .then<ExpenseEntity[]>(() => {
          let whereClause;
          switch (date) {
            case 'today':

              const today = moment().format().split('T')[0];
              whereClause = Like(today + '%');
              break;
            case 'yesterday':
              const yesterday = moment().subtract(1, 'days').format().split('T')[0];
              whereClause = Like( yesterday + '%');
              break;
            case 'this-week':

              const day = this._date.getDay() > 0 ? this._date.getDay() - 1 : 6;
              let start_0 = moment().subtract(day, 'days').format('YYYY-MM-DD');
              let end_0 = moment().format('YYYY-MM-DD');
              // settings the time on dates
              start_0 += ' 00:00:00';
              end_0 += ' 23:59:00';
              whereClause = Between(start_0, end_0); // where clause between start of week and today
              break;
            case 'this-month':

              const day1 = this._date.getDate() - 1;
              let start_1 = moment().subtract(day1, 'days').format('YYYY-MM-DD');
              let end_1 = moment().format('YYYY-MM-DD');
              // settings the time on dates
              start_1 += ' 00:00:00';
              end_1 += ' 23:59:00';

              whereClause = Between(start_1, end_1);
              break;
          }

          const options: FindManyOptions<ExpenseEntity> = {
            relations: ['staff'],
            where: {createdAt: whereClause},
            order: {id: 'DESC'}
          };
          // get storage
          return ExpenseEntity.find(options);
        });
  }
  /**
   * @method
   * @name getExpenseByDateRange
   * @description get sales objects in the interval specified
   * */
  getExpenseByDateRange(start: string , end: string): Promise<ExpenseEntity[]> {
    return this.connection
        .then<ExpenseEntity[]>(() => {
          let startDate = moment(start).format('YYYY-MM-DD');
          let endDate = moment(end).format('YYYY-MM-DD');
          // ===========
          startDate += ' 00:00:00';
          endDate += ' 23:00:00';

          const options: FindManyOptions<ExpenseEntity> = {
            relations: ['staff'],
            where: {createdAt: Between(startDate, endDate)},
            order: {id: 'DESC'}
          };
          // get storage
          return ExpenseEntity.find(options);
        });
  }
  /**
   * @method
   * @name searchExpense
   * @param query
   * @description search expense database
   * */
  searchExpense(query: any): Promise<ExpenseEntity[]> {
    return this.connection
        .then<ExpenseEntity[]>(() => {
          const options: FindManyOptions<ExpenseEntity> = {
            relations: ['staff'],
            where: {
              invoiceNumber: Like(`%${query}%`)
            },
            order: {id: 'DESC'}
          };
          // get storage
          return ExpenseEntity.find(options);
        });
  }
  /**
   * @method
   * @name addExpense
   * @param expense: Expense object
   * @description add to sales
   * */
  addExpense(expense: any): Promise<ExpenseModel> {
    return this.connection
        .then<ExpenseEntity>(() => {
          const {description, frequency, staff, category, amount} = expense;
          return ExpenseEntity.create({ description, frequency, staff, category, amount }).save();
        });
  }
  /**
   * @method
   * @name deleteExpense
   * @param id
   * @description delete sale item
   *
   *
   * */
  deleteExpense(id: number): Promise<any> {
    return this.connection
        .then(() => {
          return ExpenseEntity.delete(id);
        });
  }
  /**
   * =======================================================
   * =================== REPORTS ==============
   * =======================================================
   */
  /**
   * @method
   * @name getReports
   * @description get reports data from database
   * */
  getReports(): Promise<ReportsEntity[]> {
    return this.connection
        .then<ReportsEntity[]>(() => {
          const options: FindManyOptions<ReportsEntity> = {
            relations: ['menuCategoryConnection', 'menuCategoryConnection.menuCategory', 'menuItemConnection', 'menuItemConnection.menuItem'],
            order: {id: 'DESC'}
          };
          // get average
          // get reports
          return ReportsEntity.find(options);
        });
  }
  /**
   * @method
   * @name getReportsByDateId
   * @description get reports data of specific day from database
   * */
  getReportsByDateId(day: string): Promise<ReportsEntity> {
    return this.connection
        .then<ReportsEntity>(() => {
          const options: FindManyOptions<ReportsEntity> = {
            relations: ['menuCategoryConnection', 'menuCategoryConnection.menuCategory', 'menuItemConnection', 'menuItemConnection.menuItem'],
            where: {dateId: day}
          };
          // get reports
          return ReportsEntity.find(options).then((data) => data[0]);
        });
  }
  /**
   * @method
   * @name getReportsByDate
   * @description get reports data from database
   * */
  getReportsByDate(start: string, end: string): Promise<ReportsEntity[]> {
    return this.connection
        .then<ReportsEntity[]>(() => {
          let _startDate = moment(start).format('YYYY-MM-DD');
          let _endDate = moment(end).format('YYYY-MM-DD');
          // ===========
          _startDate += ' 00:00:00';
          _endDate += ' 23:00:00';
          // const startDate = new Date(_startDate).getTime();
          // const endDate = new Date(_endDate).getTime();
          // reports obj
          const reports = {grossProfits: 0, totalExpenses: 0, lowQuantityMenuItems: 0, averageDailySales: 0};
          // get sales
          const options: FindManyOptions<ReportsEntity> = {
            relations: ['menuCategoryConnection', 'menuCategoryConnection.menuCategory', 'menuItemConnection', 'menuItemConnection.menuItem'],
            where: {createdAt: Between(_startDate, _endDate)},
            order: {id: 'DESC'}
          };
          // get reports
          return ReportsEntity.find(options);
        });
  }
}
