/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/
import { Column, BaseEntity, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn, JoinTable} from 'typeorm';
import {SaleEntity, MenuItemEntity} from './index';

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
*/
