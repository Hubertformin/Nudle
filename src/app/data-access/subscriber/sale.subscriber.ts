/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */

import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {ReportsEntity, SaleCounterEntity, SaleEntity} from '../entities';
import * as moment from 'moment';

@EventSubscriber()
export class SaleSubscriber implements EntitySubscriberInterface<SaleEntity> {


  /**
   * Indicates that this subscriber only listen to Sale events.
   */
  listenTo() {
    return SaleEntity;
  }
  /**
   * @method
   * @name afterInsert
   * @description Called after insert
   * */
  async afterInsert(event: InsertEvent<SaleEntity>) {
      // get last sale count from db.
      const saleCount = await SaleCounterEntity.findOne(1);
      /**
       * Get new count
       * 1. If the last updated counter was on a different date that now, reset counter to 1
       * 2. Else if the counter was last updated on the same day, increment the counter
       * */
      const newCount =
        (new Date(saleCount.updatedAt).toDateString() === new Date().toDateString()) ? Number(saleCount.count) + 1 : 1;
      // update counter
      await SaleCounterEntity.update(1, {count: newCount});
      /**
       * get current sale with all required relations
       * **/
      const _sale_ = event.entity;
       /* 1. increment reports
       * */
      const amount = _sale_.totalAmount;

      ReportsEntity.createQueryBuilder()
        .update()
        .set({ grossProfits: () => `grossProfits + ${amount}`})
        .where({dateId: 'GLOBAL'})
        .execute();
      /***
       * ADD REPORTS TO REPORTS DATABASE AS SINGLE DATE
       * **/
      const _sale_date = moment(_sale_.createdAt).format('YYYY-MM-DD');
      // get report with current sale date..
      const current_report = await ReportsEntity.find({where: {dateId: _sale_date}, take: 1 });
      /**
       * if current report exit, increment values, else
       * */
      if (current_report.length > 0) {
        ReportsEntity.createQueryBuilder()
          .update()
          .set({ grossProfits: () => `grossProfits + ${amount}`, averageDailySales: () => `averageDailySales + ${1}`})
          .where({id: current_report[0].id})
          .execute();
        // update menu-items and menu-category
      } else {
        await ReportsEntity.create({grossProfits: amount, dateId: _sale_date})
          .save();
      }
  }

}
