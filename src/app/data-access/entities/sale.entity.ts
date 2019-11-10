/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/
import {PrimaryGeneratedColumn, Column, BaseEntity, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import {SaleMenuItem, StaffEntity, StaffModel} from './index';

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
  /!**
   * Relationships...
   * *!/
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
*/
