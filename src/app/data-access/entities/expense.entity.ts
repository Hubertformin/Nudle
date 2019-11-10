/*
/!*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 *!/
import {PrimaryGeneratedColumn, Column, BaseEntity, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {StaffEntity} from './index';

@Entity({name: 'expense'})
export class ExpenseEntity extends BaseEntity implements ExpenseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  category: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  frequency: number;

  @Column()
  amount: number;
  /!**
   * Relations
   * *!/
  @ManyToOne(type => StaffEntity, staff => staff.expenses)
  staff: StaffEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface ExpenseModel {
  id: number;
  category: string;
  description: string;
  frequency: number;
  amount: number;
  staff: StaffEntity;
  createdAt: Date;
  updatedAt: Date;
}

*/
