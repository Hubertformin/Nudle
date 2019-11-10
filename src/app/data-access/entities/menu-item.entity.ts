/*
/!*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/

import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BaseEntity} from 'typeorm';
import {MenuCategoryEntity} from './menu-category.entity';
import {StaffEntity} from './staff.entity';
import {IngredientEntity} from './ingredient.entity';
import {SaleMenuItem} from './saleMenuItem.entity';
import {MenuItemReportEntity} from './menu-reports.entity';

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

  /!**
   * relations
   * *!/

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
*/
