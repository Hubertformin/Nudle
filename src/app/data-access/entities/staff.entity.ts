/*
/!*
 * Copyright (c) 2019. A production of Enchird, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/
import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {IsEmail} from 'class-validator';
import {StaffGroupEntity} from './staff-group.entity';
import {MenuItemEntity} from './menu-item.entity';
import {WasteEventEntity} from './waste-event.entity';
import {SaleEntity} from './sale.entity';
import {ExpenseEntity} from './expense.entity';
import {SafeUrl} from '@angular/platform-browser';
import {BranchEntity} from './branch.entity';

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
  /!**
   * relations
   * *!/
  @ManyToOne(type => StaffGroupEntity, sGroup => sGroup.staff)
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
  id: number | string;
  firstName: string;
  lastName: string;
  branch?: BranchEntity;
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
/!**
 * @interface
 * @name UserPermissionsModel
 * *!/
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
  ORDERS_CREATE: boolean;
  ORDERS_READ: boolean;
  ORDERS_DELETE: boolean;
  ORDERS_UPDATE: boolean;
}

/!**
 * @class UserPermissions
 * @param defaultValue
 * *!/
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
  ORDERS_CREATE: boolean;
  ORDERS_DELETE: boolean;
  ORDERS_READ: boolean;
  ORDERS_UPDATE: boolean;
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
    this.ORDERS_CREATE = defaultValue;
    this.ORDERS_DELETE = defaultValue;
    this.ORDERS_READ = defaultValue;
    this.ORDERS_UPDATE = defaultValue;
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

/!**
 * @interface
 * @name FileImport
 * *!/
export interface FileImport {
  string: string;
  type: string;
}

export interface StaffAltModel extends StaffModel {
  profileImage: SafeUrl | string;
}
*/
