/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */

import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {ItemEntity, MenuCategoryReportsEntity, MenuItemReportEntity, ReportsEntity, SaleMenuItem} from '../entities';
import * as moment from 'moment';

@EventSubscriber()
export class MenuSaleSubscriber implements EntitySubscriberInterface<SaleMenuItem> {
  listenTo() {
    return SaleMenuItem;
  }
  // after insert
  async afterInsert(event: InsertEvent<SaleMenuItem>) {
    console.log('calling after insert');
    /**
     * 1. Menu items reports
     * */
    const _sale_menuItem = event.entity;
    const _sale_date = moment(_sale_menuItem.createdAt).format('YYYY-MM-DD');
    // get report with current sale date..

    // if (current_report.length > 0) {
    //   await MenuItemReportEntity.createQueryBuilder()
    //     .update()
    //     .set({ amount: () => `amount + ${_sale_menuItem.amount}`})
    //     .where({menuItemId: _sale_menuItem.menuItemId, reportId: current_report[0].id})
    //     .execute();
    //   /**
    //    * 1. Menu Category reports reports
    //    * */
    //   await MenuCategoryReportsEntity.createQueryBuilder()
    //     .update()
    //     .set({ amount: () => `amount + ${_sale_menuItem.amount}`})
    //     .where({menuCategoryId: _sale_menuItem.menuItem.category.id, reportId: current_report[0].id})
    //     .execute();
    // }

      /**
       * 1. GET REPORT OBJECT IF EXIST OR CREATE IF NOT EXIST
       * */
      const current_report = await ReportsEntity.find({where: {dateId: _sale_date}, take: 1 }); // current report(Report ot today or date of recent sale)
      const report = current_report[0];
      // get menu item report if exist
      const item_report = await MenuItemReportEntity.find({where: {menuItemId: _sale_menuItem.menuItemId, reportId: report.id}, take: 1});
      // get menu category report if exist
      const category_report =
        await MenuCategoryReportsEntity.find({where: {menuCategoryId: _sale_menuItem.menuItem.category.id, reportId: report.id}, take: 1});
      // update record if the menu item already exist in menu report table
      if (item_report.length > 0) {
          MenuItemReportEntity.createQueryBuilder()
            .update()
            .set({ amount: () => `amount + ${_sale_menuItem.amount}`, orderQuantity: () => `orderQuantity + ${_sale_menuItem.orderQuantity}`})
            .where({menuItemId: _sale_menuItem.menuItemId, reportId: report.id})
            .execute();
      }
      // update category record report if category exist in report
      if (category_report.length > 0) {
        MenuCategoryReportsEntity.createQueryBuilder()
          .update()
          .set({ amount: () => `amount + ${_sale_menuItem.amount}`, orderQuantity: () => `orderQuantity + ${_sale_menuItem.orderQuantity}`})
          .where({menuCategoryId: _sale_menuItem.menuItem.category.id, reportId: report.id})
          .execute();
      }
      // if menu or category report's don't exist
      if (item_report.length === 0) {
        // add into menu-item reports
        MenuItemReportEntity
        .create({reportId: report.id, menuItemId: _sale_menuItem.menuItemId, amount: _sale_menuItem.amount, orderQuantity: _sale_menuItem.orderQuantity})
        .save();
      }
      if (category_report.length === 0) {
        // add into menu_category reports
        MenuCategoryReportsEntity
          .create({reportId: report.id, menuCategoryId: _sale_menuItem.menuItem.category.id, amount: _sale_menuItem.amount, orderQuantity: _sale_menuItem.orderQuantity})
          .save();
      }
      /**
       * reduce inventory items
       * **/
      for (const ingredient of _sale_menuItem.menuItem.ingredients) {
        if (ingredient.item.quantity > (_sale_menuItem.orderQuantity * ingredient.quantity)) {
          ItemEntity.createQueryBuilder()
            .update()
            .set({ quantity: () => `quantity - ${_sale_menuItem.orderQuantity * ingredient.quantity}`})
            .where({menuItemId: _sale_menuItem.menuItemId, reportId: report.id})
            .execute();
        }
      }
  }
}
