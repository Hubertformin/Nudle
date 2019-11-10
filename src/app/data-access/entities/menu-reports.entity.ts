/*
/!*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/


import {BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryColumn} from 'typeorm';
import {MenuCategoryEntity, MenuItemEntity, ReportsEntity} from './index';

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
  /!*
  * Relations with reports table and menu items.....
  * *!/
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
*/
