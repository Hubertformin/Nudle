/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/

import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity} from 'typeorm';
import {StaffEntity} from './staff.entity';

@Entity({name: 'waste_event'})
export class WasteEventEntity extends BaseEntity implements WasteEventModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  description: string;
  /!**
   * relations
   * *!/
  @ManyToOne(type => StaffEntity, staff => staff.wasteEvents)
  staff: StaffEntity;

  // timestamps
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

export interface WasteEventModel {
  id: number;
  quantity: number;
  description: string;
  /!**
   * relations
   * *!/
  staff: StaffEntity;
  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

*/
