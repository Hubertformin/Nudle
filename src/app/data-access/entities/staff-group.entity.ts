/*

/!*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/
import {Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, BaseEntity} from 'typeorm';
import {StaffEntity, UserPermissionsModel} from './staff.entity';

export interface StaffGroupModel {
  id: number;
  name: string;
  permissions: UserPermissionsModel;
  isRoot: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Entity({name: 'staff_group'})
export class StaffGroupEntity extends BaseEntity implements StaffGroupModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true
  })
  name: string;

  @Column('simple-json')
  permissions: UserPermissionsModel;

  @Column({default: false})
  isRoot: boolean;

  // relations
  @OneToMany(type => StaffEntity, staff => staff.group)
  staff: StaffEntity[];

  // time stamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

*/
