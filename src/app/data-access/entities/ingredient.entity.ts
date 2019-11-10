/*
/!*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/

import {Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinTable, PrimaryColumn, BaseEntity} from 'typeorm';
import {MenuItemEntity} from './menu-item.entity';
import {ItemEntity} from './item.entity';

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
  /!**
   * RELATIONS
   * *!/
  @ManyToOne(type => MenuItemEntity, mItem => mItem.ingredients, {onDelete: 'CASCADE'})
  @JoinTable({name: 'menuItemId'})
  menuItem!: MenuItemEntity;
  @ManyToOne(type => ItemEntity, item => item.ingredients, {onDelete: 'CASCADE'})
  @JoinTable({name: 'menuItemId'})
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
  /!**
   * RELATIONS
   * *!/
  menuItem: MenuItemEntity;
  item: ItemEntity;
  // timestamps!
  createdAt: Date;
  updatedAt: Date;
}
*/
