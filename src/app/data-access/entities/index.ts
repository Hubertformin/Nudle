/*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
/*import {BranchEntity, BranchModel} from './branch.entity';
import {IngredientEntity, IngredientModel} from './ingredient.entity';
import {ItemEntity, ItemModel} from './item.entity';
import {MenuCategoryEntity, MenuCategoryModel} from './menu-category.entity';
import {MenuItemEntity, MenuItemModel} from './menu-item.entity';
import {StaffEntity, StaffModel, FileImport, UserPermissionsModel, UserPermissions, StaffAltModel} from './staff.entity';
import {StaffGroupEntity, StaffGroupModel} from './staff-group.entity';
import {WasteEventEntity, WasteEventModel} from './waste-event.entity';
import {StorageAreaEntity, StorageAreaModel} from './storage-area.entity';
import {SupplierEntity, SupplierModel} from './supplier.entity';
import {ItemToStorageArea} from './itemStorage.entity';
import { ItemToSupplier } from './itemSupplier.entity';
import {SaleEntity, SaleModel} from './sale.entity';
import {SaleMenuItem} from './saleMenuItem.entity';
import {ExpenseEntity, ExpenseModel} from './expense.entity';
import {SaleCounterEntity, SaleCounterModel} from './saleCounter.entity';
import {ReportsEntity, ReportsModel} from './reports.entity';
import { MenuItemReportEntity, MenuCategoryReportsEntity } from './menu-reports.entity';

export {
  BranchEntity,
  ItemEntity,
  IngredientEntity,
  MenuItemEntity,
  MenuCategoryEntity,
  StaffGroupEntity,
  StaffEntity,
    UserPermissions,
  WasteEventEntity,
  StorageAreaEntity,
  SupplierEntity,
  ItemToStorageArea,
  ItemToSupplier,
  SaleEntity,
  SaleMenuItem,
  ExpenseEntity,
  SaleCounterEntity,
  ReportsEntity,
  MenuItemReportEntity,
  MenuCategoryReportsEntity
};
export {
  BranchModel,
  ExpenseModel,
  FileImport,
  StaffModel,
  UserPermissionsModel,
  IngredientModel,
  ItemModel,
  MenuItemModel,
  MenuCategoryModel,
  StaffGroupModel,
  WasteEventModel,
  StorageAreaModel,
  SupplierModel,
  StaffAltModel,
  SaleModel,
  SaleCounterModel,
  ReportsModel
};
*/

export interface StaffGroupModel {
    id: number;
    name: string;
    permissions: UserPermissionsModel;
    isRoot: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Entity({name: 'staff_group'})
export class StaffGroupEntity extends BaseEntity implements StaffGroupModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    name: string;

    @Column('simple-json')
    permissions: UserPermissionsModel;

    @Column({default: false})
    isRoot: boolean;

    // relations
    @OneToMany(type => StaffEntity, staff => staff.group)
    staff: StaffEntity[];

    // time stamps
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, JoinTable,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {IsEmail} from 'class-validator';

@Entity({name: 'staff'})
export class StaffEntity extends BaseEntity implements StaffModel {
    // primary key
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({default: true})
    isActive: boolean;

    @Column({default: false})
    isManager: boolean;

    @Column({nullable: true})
    userName: string;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
        nullable: true
    })
    @IsEmail()
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true
    })
    phoneNumber: string;

    @Column({nullable: true})
    gender: string;

    @Column({nullable: true})
    age: number;

    @Column({nullable: true})
    salary: number;

    @Column({nullable: true})
    contractType: string;

    @Column({type: 'simple-array', nullable: true})
    workShift: string[];

    @Column({nullable: true})
    imageUrl: string;

    @Column({type: 'simple-json', nullable: true})
    resumeUrl: FileImport;

    @Column({type: 'simple-json', nullable: true})
    permissions: UserPermissionsModel;
    /**
     * relations
     * */
    @ManyToOne(type => StaffGroupEntity, sGroup => sGroup.staff)
    @JoinColumn()
    group: StaffGroupEntity;
    @OneToMany(type => MenuItemEntity, mItem => mItem.staff)
    menuItems: MenuItemEntity[];
    @OneToMany(type => WasteEventEntity, wEvent => wEvent.staff)
    wasteEvents: WasteEventEntity[];
    @OneToMany(type => SaleEntity, sales => sales.cashier)
    issuedSales: SaleEntity[];
    @OneToMany(type => SaleEntity, sales => sales.waiter)
    receivedSales: SaleEntity[];
    @OneToMany(type => ExpenseEntity, expense => expense.staff)
    expenses: ExpenseEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

// export interfac
export interface StaffModel {
    id: number;
    firstName: string;
    lastName: string;
    // branch?: BranchEntity;
    isActive?: boolean;
    isManager?: boolean;
    userName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    gender?: string;
    age?: number;
    salary?: number;
    contractType?: string;
    workShift?: string[];
    imageUrl?: string;
    resumeUrl?: FileImport;
    permissions?: UserPermissionsModel;
    group?: StaffGroupEntity;
    menuItems?: MenuItemEntity[];
    wasteEvents?: WasteEventEntity[];
    issuedSales?: SaleEntity[];
    receivedSales?: SaleEntity[];
    expenses?: ExpenseEntity[];
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * @interface
 * @name UserPermissionsModel
 * */
export interface UserPermissionsModel {
    USERS_CREATE: boolean;
    USERS_READ: boolean;
    USERS_DELETE: boolean;
    USERS_UPDATE: boolean;
    INVOICES_CREATE: boolean;
    INVOICES_READ: boolean;
    INVOICES_DELETE: boolean;
    INVOICES_UPDATE: boolean;
    BRANCH_CREATE: boolean;
    BRANCH_READ: boolean;
    BRANCH_DELETE: boolean;
    BRANCH_UPDATE: boolean;
    MENU_ITEMS_CREATE: boolean;
    MENU_ITEMS_READ: boolean;
    MENU_ITEMS_DELETE: boolean;
    MENU_ITEMS_UPDATE: boolean;
    REPORTS_CREATE: boolean;
    REPORTS_READ: boolean;
    REPORTS_DELETE: boolean;
    REPORTS_UPDATE: boolean;
    INVENTORY_CREATE: boolean;
    INVENTORY_READ: boolean;
    INVENTORY_DELETE: boolean;
    INVENTORY_UPDATE: boolean;
}

/**
 * @class UserPermissions
 * @param defaultValue
 * */
export class UserPermissions implements UserPermissionsModel {
    BRANCH_CREATE: boolean;
    BRANCH_DELETE: boolean;
    BRANCH_READ: boolean;
    BRANCH_UPDATE: boolean;
    INVOICES_CREATE: boolean;
    INVOICES_DELETE: boolean;
    INVOICES_READ: boolean;
    INVOICES_UPDATE: boolean;
    MENU_ITEMS_CREATE: boolean;
    MENU_ITEMS_DELETE: boolean;
    MENU_ITEMS_READ: boolean;
    MENU_ITEMS_UPDATE: boolean;
    INVENTORY_CREATE: boolean;
    INVENTORY_DELETE: boolean;
    INVENTORY_READ: boolean;
    INVENTORY_UPDATE: boolean;
    REPORTS_CREATE: boolean;
    REPORTS_DELETE: boolean;
    REPORTS_READ: boolean;
    REPORTS_UPDATE: boolean;
    USERS_CREATE: boolean;
    USERS_DELETE: boolean;
    USERS_READ: boolean;
    USERS_UPDATE: boolean;

    constructor(defaultValue = false) {
        this.BRANCH_CREATE = defaultValue;
        this.BRANCH_DELETE = defaultValue;
        this.BRANCH_READ = defaultValue;
        this.BRANCH_UPDATE = defaultValue;
        this.INVOICES_CREATE = defaultValue;
        this.INVOICES_DELETE = defaultValue;
        this.INVOICES_READ = defaultValue;
        this.INVOICES_UPDATE = defaultValue;
        this.MENU_ITEMS_CREATE = defaultValue;
        this.MENU_ITEMS_DELETE = defaultValue;
        this.MENU_ITEMS_READ = defaultValue;
        this.MENU_ITEMS_UPDATE = defaultValue;
        this.INVENTORY_CREATE = defaultValue;
        this.INVENTORY_DELETE = defaultValue;
        this.INVENTORY_READ = defaultValue;
        this.INVENTORY_UPDATE = defaultValue;
        this.REPORTS_CREATE = defaultValue;
        this.REPORTS_DELETE = defaultValue;
        this.REPORTS_READ = defaultValue;
        this.REPORTS_UPDATE = defaultValue;
        this.USERS_CREATE = defaultValue;
        this.USERS_DELETE = defaultValue;
        this.USERS_READ = defaultValue;
        this.USERS_UPDATE = defaultValue;
    }
}

/**
 * @interface
 * @name FileImport
 * */
export interface FileImport {
    string: string;
    type: string;
}
/*
*                    ================ MENU ITEMS ============
*
* */

@Entity({name: 'menu_category'})
export class MenuCategoryEntity extends BaseEntity implements MenuCategoryModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // relations
    @OneToMany(type => MenuItemEntity, mItem => mItem.category)
    menuItems: MenuItemEntity[];
    @OneToMany(type => MenuCategoryReportsEntity, report => report.menuCategory)
    reportsConnection: MenuCategoryReportsEntity[];
    // timestamps
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}

export interface MenuCategoryModel {
    id: number;
    name: string;
    // relations
    menuItems: MenuItemEntity[];
    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

@Entity({name: 'menu_item'})
export class MenuItemEntity extends BaseEntity implements MenuItemModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column()
    unitPrice: number;

    @Column({nullable: true})
    units: string;

    @Column({nullable: true, unique: true})
    posCode: string;

    @Column({nullable: true})
    stackable: boolean;

    @Column({nullable: true})
    quantity: number;

    @Column({nullable: true})
    cookTime: number;

    @Column({nullable: true})
    procedureDescription: string;

    /**
     * relations
     * */

    @ManyToOne(type => MenuCategoryEntity, mCategory => mCategory.menuItems)
    category: MenuCategoryEntity;

    @ManyToOne(type => StaffEntity, staff => staff.menuItems)
    staff: StaffEntity;

    @OneToMany(type => IngredientEntity, ingredient => ingredient.menuItem)
    ingredients: IngredientEntity[];

    @OneToMany(type => SaleMenuItem, saleMenuItem => saleMenuItem.menuItem)
    saleConnection: SaleMenuItem[];

    @OneToMany(type => MenuItemReportEntity, mReport => mReport.menuItem)
    reportsConnection: MenuItemReportEntity[];
    // timestamps
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}

export interface MenuItemModel {
    id: number;
    name: string;
    unitPrice: number;
    units: string;
    posCode: string;
    stackable: boolean;
    quantity: number;
    cookTime: number;
    procedureDescription: string;
    category: MenuCategoryEntity;
    staff: StaffEntity;
    ingredients: IngredientEntity[];
    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

// inventory
@Entity({name: 'item'})
export class ItemEntity extends BaseEntity implements ItemModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    unitCost: number;

    @Column({nullable: true})
    minOrderQuantity!: number;

    @Column({nullable: true})
    units: string;

    @Column({nullable: true})
    quantity: number;
    /**
     * RELATIONS
     * */
    @OneToMany( type => ItemToSupplier, supplier => supplier.item)
    supplierConnection: ItemToSupplier[];

    @OneToMany(type => ItemToStorageArea, itemStorage => itemStorage.item)
    storageAreaConnection: ItemToStorageArea[];

    @OneToMany(type => IngredientEntity, ingredient => ingredient.item)
    ingredients: IngredientEntity[];
    // timestamps
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}

export interface ItemModel {
    id: number;
    name: string;
    unitCost: number;
    minOrderQuantity: number;
    quantity: number;
    units: string;
    suppliers?: SupplierEntity[];
    storageAreas?: StorageAreaEntity[];
    /**
     * RELATIONS
     * */
    ingredients?: IngredientEntity[];
    // timestamps
    createdAt?: Date;
    updatedAt?: Date;
}

@Entity({name: 'supplier'})
export class SupplierEntity extends BaseEntity implements SupplierModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(type => ItemToSupplier, itemSupp => itemSupp.supplier)
    supplierConnection: ItemToSupplier[];
    // timestamps
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}

export interface SupplierModel {
    id: number;
    name: string;
    description: string;
    items?: ItemEntity[];
    createdAt?: Date;
    updatedAt?: Date;
}

@Entity({name: 'storage_area'})
export class StorageAreaEntity extends BaseEntity implements StorageAreaModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(type => ItemToStorageArea, itemStorage => itemStorage.item)
    public itemConnection: ItemToStorageArea[];
}

export interface StorageAreaModel {
    id: number;
    name: string;
    description: string;
    items?: ItemToStorageArea[];
}

@Entity({name: 'ingredient'})
export class IngredientEntity extends BaseEntity implements  IngredientModel {
    @PrimaryColumn()
    public menuItemId!: number;

    @PrimaryColumn()
    public itemId!: number;

    @Column('double')
    public quantity!: number;

    @Column()
    public units!: string;
    /**
     * RELATIONS
     * */
    @ManyToOne(type => MenuItemEntity, mItem => mItem.ingredients, {onDelete: 'CASCADE'})
    @JoinTable({name: 'menuItemId'})
    menuItem!: MenuItemEntity;
    @ManyToOne(type => ItemEntity, item => item.ingredients, {onDelete: 'CASCADE'})
    @JoinTable({name: 'itemId'})
    item!: ItemEntity;

    // timestamps!
    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}

export interface IngredientModel {
    menuItemId: number;
    itemId: number;
    quantity: number;
    units: string;
    /**
     * RELATIONS
     * */
    menuItem: MenuItemEntity;
    item: ItemEntity;
    // timestamps!
    createdAt: Date;
    updatedAt: Date;
}

@Entity({name: 'item_to_supplier'})
export class ItemToSupplier extends BaseEntity {
    @PrimaryColumn()
    public itemId!: number;

    @PrimaryColumn()
    public supplierId!: number;

    @Column({nullable: true})
    public quantity: number;

    @ManyToOne(type => ItemEntity, item => item.supplierConnection, {
        onDelete: 'CASCADE'
    })
    @JoinTable({name: 'itemId'})
    public item!: ItemEntity;

    @ManyToOne(type => SupplierEntity, supplier => supplier.supplierConnection, {
        onDelete: 'CASCADE'
    })
    @JoinTable({name: 'supplierId'})
    public supplier!: SupplierEntity;
}


/*=======================================================
*
* ========================================================*/

@Entity({name: 'item_storage_area'})
export class ItemToStorageArea extends BaseEntity {
    @PrimaryColumn()
    public itemId!: number;

    @PrimaryColumn()
    public storageAreaId!: number;

    @Column({nullable: true})
    public quantity: number;

    @ManyToOne(type => ItemEntity, item => item.storageAreaConnection, {onDelete: 'CASCADE'})
    @JoinTable({name: 'itemId'})
    public item!: ItemEntity;

    @ManyToOne(type => StorageAreaEntity, storage => storage.itemConnection, {onDelete: 'CASCADE'})
    @JoinTable({name: 'storageAreaId'})
    public storageArea!: StorageAreaEntity;
}


// sale
@Entity({name: 'sale'})
export class SaleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    invoiceNumber: string;

    @Column()
    totalAmount: number;

    @Column({nullable: true})
    discount: number;

    @Column({nullable: true})
    tableId: string;

    @Column({default: true})
    completed: boolean;
    /**
     * Relationships...
     * */
    @ManyToOne(type => StaffEntity, staff => staff.issuedSales, {onDelete: 'SET NULL'})
    cashier: StaffEntity;

    @ManyToOne(type => StaffEntity, staff => staff.receivedSales, {onDelete: 'SET NULL'})
    waiter: StaffEntity;

    @OneToMany(type => SaleMenuItem, saleMenuItem => saleMenuItem.sale)
    menuItemConnection: SaleMenuItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export interface SaleModel {
    id?: number;
    invoiceNumber: string;
    totalAmount: number;
    completed?: boolean;
    discount?: number;
    tableId?: string;
    cashier?: StaffModel;
    waiter?: StaffModel;
    menuItemConnection?: SaleMenuItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

@Entity({name: 'sale_menu_item'})
export class SaleMenuItem extends BaseEntity {
    @PrimaryColumn()
    saleId!: number;

    @PrimaryColumn()
    menuItemId!: number;

    @Column()
    orderQuantity!: number;

    @Column()
    amount: number;

    @ManyToOne(type => SaleEntity, sale => sale.menuItemConnection, {onDelete: 'CASCADE'})
    @JoinTable({name: 'saleId'})
    sale: SaleEntity;

    @ManyToOne(type => MenuItemEntity, mItem => mItem.saleConnection, {onDelete: 'CASCADE'})
    @JoinTable({name: 'menuItemId'})
    menuItem: MenuItemEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity({name: 'reports'})
export class ReportsEntity extends BaseEntity implements ReportsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    grossProfits: number;

    @Column({default: 0})
    totalExpenses: number;

    @Column({nullable: true, unique: true})
    dateId: string;

    @Column({default: 0})
    averageDailySales: number;
    /**
     * RELATIONS
     * */
    @OneToMany(type => MenuCategoryReportsEntity, report => report.report)
    menuCategoryConnection: MenuCategoryReportsEntity[];

    @OneToMany(type => MenuItemReportEntity, mReport => mReport.report)
    menuItemConnection: MenuItemReportEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export interface ReportsModel {
    id?: number;
    grossProfits: number;
    totalExpenses: number;
    dateId?: string;
    averageDailySales: number;
    menuCategoryConnection?: MenuCategoryReportsEntity[];
    menuItemConnection?: MenuItemReportEntity[];
    createdAt?: Date;
    updatedAt?: Date;
}


@Entity({name: 'menu_item_report'})
export class MenuItemReportEntity extends BaseEntity {
    @PrimaryColumn()
    reportId: number;

    @PrimaryColumn()
    menuItemId: number;

    @Column({nullable: true})
    amount: number;

    @Column({nullable: true})
    orderQuantity: number;
    /*
    * Relations with reports table and menu items.....
    * */
    @ManyToOne(type => MenuItemEntity, item => item.reportsConnection, {onDelete: 'SET NULL'})
    @JoinTable({name: 'menuItemId'})
    public menuItem!: MenuItemEntity;

    @ManyToOne(type => ReportsEntity, report => report.menuItemConnection, {onDelete: 'CASCADE'})
    @JoinTable({name: 'reportId'})
    public report!: ReportsEntity;
}

@Entity({name: 'menu_category_report'})
export class MenuCategoryReportsEntity extends BaseEntity {
    @PrimaryColumn()
    reportId: number;

    @PrimaryColumn()
    menuCategoryId: number;

    @Column({nullable: true})
    amount: number;

    @Column({nullable: true})
    orderQuantity: number;
    // relations
    @ManyToOne(type => MenuCategoryEntity, mCat => mCat.reportsConnection, {onDelete: 'SET NULL'})
    @JoinTable({name: 'menuCategoryId'})
    public menuCategory!: MenuCategoryEntity;

    @ManyToOne(type => ReportsEntity, report => report.menuCategoryConnection, {onDelete: 'CASCADE'})
    @JoinTable({name: 'reportId'})
    public report!: ReportsEntity;
}


@Entity({name: 'expense'})
export class ExpenseEntity extends BaseEntity implements ExpenseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    category: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    frequency: number;

    @Column()
    amount: number;
    /**
     * Relations
     * */
    @ManyToOne(type => StaffEntity, staff => staff.expenses)
    staff: StaffEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export interface ExpenseModel {
    id: number;
    category: string;
    description: string;
    frequency: number;
    amount: number;
    staff: StaffEntity;
    createdAt: Date;
    updatedAt: Date;
}


@Entity({name: 'waste_event'})
export class WasteEventEntity extends BaseEntity implements WasteEventModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column()
    description: string;
    /**
     * relations
     * */
    @ManyToOne(type => StaffEntity, staff => staff.wasteEvents)
    staff: StaffEntity;

    // timestamps
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}

export interface WasteEventModel {
    id: number;
    quantity: number;
    description: string;
    /**
     * relations
     * */
    staff: StaffEntity;
    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

@Entity({name: 'sale_counter'})
export class SaleCounterEntity extends BaseEntity implements SaleCounterModel {
    @PrimaryColumn({unique: true})
    id: number;

    @Column()
    count: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export interface SaleCounterModel {
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

