/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/

// Intermediary table for storage areas and Item
import {BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryColumn,} from 'typeorm';
import {ItemEntity} from './item.entity';
import {SupplierEntity} from './index';

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
  @JoinTable({name: 'storageAreaId'})
  public supplier!: SupplierEntity;
}
*/
