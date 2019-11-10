/*
import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {MenuCategoryReportsEntity, MenuItemReportEntity} from './menu-reports.entity';

@Entity({name: 'reports'})
export class ReportsEntity extends BaseEntity implements ReportsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  grossProfits: number;

  @Column({default: 0})
  totalExpenses: number;

  @Column({nullable: true, unique: true})
  dateId: string;

  @Column({default: 0})
  averageDailySales: number;
  /!**
   * RELATIONS
   * *!/
  @OneToMany(type => MenuCategoryReportsEntity, report => report.report)
  menuCategoryConnection: MenuCategoryReportsEntity[];

  @OneToMany(type => MenuItemReportEntity, mReport => mReport.report)
  menuItemConnection: MenuItemReportEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface ReportsModel {
  id?: number;
  grossProfits: number;
  totalExpenses: number;
  dateId?: string;
  averageDailySales: number;
  menuCategoryConnection?: MenuCategoryReportsEntity[];
  menuItemConnection?: MenuItemReportEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}
*/
