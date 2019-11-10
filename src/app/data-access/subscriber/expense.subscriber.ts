/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */

import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {ExpenseEntity, ReportsEntity} from '../entities';
import * as moment from 'moment';

@EventSubscriber()
export class ExpenseSubscriber implements EntitySubscriberInterface<ExpenseEntity> {


  /**
   * Indicates that this subscriber only listen to Sale events.
   */
  listenTo() {
    return ExpenseEntity;
  }

  /**
   * @method
   * @name afterInsert
   * @description Called after insert
   * */
  async afterInsert(event: InsertEvent<ExpenseEntity>) {
    /**
     * 1. increment expense value in reports
     * */
    const amount = event.entity.amount;
    ReportsEntity.createQueryBuilder()
      .update()
      .set({ totalExpenses: () => `totalExpenses + ${amount}`})
      .where({dateId: 'GLOBAL'})
      .execute();

    const _expense = event.entity;
    const _expense_date = moment(_expense.createdAt).format('YYYY-MM-DD');
    // get report with current expense date..
    const current_report = await ReportsEntity.find({where: {dateId: _expense_date}, take: 1 });
    // if report date exist
    if (current_report.length > 0) {
      ReportsEntity.createQueryBuilder()
        .update()
        .set({ totalExpenses: () => `totalExpenses + ${amount}`})
        .where({id: current_report[0].id})
        .execute();
    } else {
      // create new report by date with expense object
      ReportsEntity.insert({totalExpenses: amount, dateId: _expense_date}).catch((err) => console.error(err));
    }
  }

}
