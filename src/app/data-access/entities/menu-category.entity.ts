/*
/!*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/

import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity} from 'typeorm';
import {MenuItemEntity} from './menu-item.entity';
import {MenuCategoryReportsEntity} from './menu-reports.entity';

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

*/
