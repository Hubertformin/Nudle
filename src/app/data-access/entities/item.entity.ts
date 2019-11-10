/*
/!*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/

import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {IngredientEntity} from './ingredient.entity';
import {StorageAreaEntity} from './storage-area.entity';
import {SupplierEntity} from './supplier.entity';
import {ItemToStorageArea} from './itemStorage.entity';
import {ItemToSupplier} from './itemSupplier.entity';

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
  /!**
   * RELATIONS
   * *!/
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
  /!**
   * RELATIONS
   * *!/
  ingredients?: IngredientEntity[];
  // timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

*/
