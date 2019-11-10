/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/

import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ItemToStorageArea} from './itemStorage.entity';

@Entity({name: 'storage_area'})
export class StorageAreaEntity extends BaseEntity implements StorageAreaModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column({nullable: true})
  description: string;

  @OneToMany(type => ItemToStorageArea, itemStorage => itemStorage.item)
  public itemConnection: ItemToStorageArea[];
}

export interface StorageAreaModel {
  id: number;
  name: string;
  description: string;
  items?: ItemToStorageArea[];
}
*/
