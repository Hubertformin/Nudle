/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/

import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ItemEntity} from './item.entity';
import {ItemToSupplier} from './itemSupplier.entity';

/!**
 * Co-dependent entities
 * **!/
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
  createdAt: Date;
  updatedAt: Date;
}
*/
