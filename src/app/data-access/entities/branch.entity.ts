/*
/!*
 * Copyright (c) 2019. A production of Enchird, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 *!/
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {StaffGroupEntity} from './staff-group.entity';
import {MenuItemEntity} from './menu-item.entity';
import {MenuCategoryEntity} from './menu-category.entity';
import {SaleEntity} from './sale.entity';
import {ExpenseEntity} from './expense.entity';
import {WasteEventEntity} from './waste-event.entity';

@Entity({name: 'branch'})
export class BranchEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  location: string;
  // timestamps
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

export interface BranchModel {
  id: number;
  name: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
  staffGroups?: StaffGroupEntity[];
  menuItems?: MenuItemEntity[];
  menuCategories?: MenuCategoryEntity[];
  sales?: SaleEntity[];
  expenses?: ExpenseEntity[];
  wasteEvents?: WasteEventEntity[];

}

*/
