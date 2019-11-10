/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/

// Intermediary table for storage areas and Item
import {BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryColumn} from 'typeorm';
import {StorageAreaEntity} from './storage-area.entity';
import {ItemEntity} from './item.entity';

@Entity({name: 'item_storage_area'})
export class ItemToStorageArea extends BaseEntity {
  @PrimaryColumn()
  public itemId!: number;

  @PrimaryColumn()
  public storageAreaId!: number;

  @Column({nullable: true})
  public quantity: number;

  @ManyToOne(type => ItemEntity, item => item.storageAreaConnection, {onDelete: 'CASCADE'})
  @JoinTable({name: 'itemId'})
  public item!: ItemEntity;

  @ManyToOne(type => StorageAreaEntity, storage => storage.itemConnection, {onDelete: 'CASCADE'})
  @JoinTable({name: 'storageAreaId'})
  public storageArea!: StorageAreaEntity;
}
*/
