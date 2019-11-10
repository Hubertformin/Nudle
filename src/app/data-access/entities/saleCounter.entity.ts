/*
/!*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/

import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';

@Entity({name: 'sale_counter'})
export class SaleCounterEntity extends BaseEntity implements SaleCounterModel {
  @PrimaryColumn({unique: true})
  id: number;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface SaleCounterModel {
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

*/
