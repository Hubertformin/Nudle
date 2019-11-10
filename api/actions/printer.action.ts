/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
import {Directories} from '../modules/directories-module';
import {PosPrintData, PosPrinter} from 'electron-pos-printer';
import * as fs from 'fs';

export interface SaleAction {
  invoiceNumber: string;
  totalAmount: number;
  tableId: number | string;
  menuItems: SaleItem[];
  cashier: any;
  waiter: any;
  discount: number;
  completed: boolean;
  branch: any;
  printOrder: boolean;
}

export interface SaleItem {
  name: string;
  unitPrice: number;
  orderQuantity: number;
  amount: number;
}

export class PrinterAction {
  /**
   * @method
   * @name printSale
   * */
  public static printSale(data: SaleAction | any): Promise<any> {
    const d = new Date();
    const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ,${d.getHours()}:${d.getMinutes()}`;
    let print_data: PosPrintData[] = [
      /*{
        type: 'bodyInit',
        css: {
          'margin': '0 0 0 0',
          'width': '250px'
        }
      },*/
      {
        type: 'text',
        value: '<h1 style="margin-bottom: 0;">' + Directories.getAppConfig().company_name + '</h1>',
        style: `font-family:monospace, cursive;text-align:center;font-weight:bold;`
      }, {
        type: 'text',
        value: `${data.invoiceNumber}${(Directories.getAppConfig().assign_waiter) ? ' - ' + data.waiter.firstName : ''}`,
        style: `text-align:center;font-size:0.7rem;font-weight:bold;margin: 2%;font-family:monospace, cursive;`
      },
      {
        type: 'text',
        value: date,
        style: `font-size: 11px;text-align:center;font-family:monospace, cursive;`
      }];
    // Creating table
    let th = '';
    data.menuItems.forEach(el => {
      /*products.orderCategories.map((il) => {
        if (el.orderCategory === il.name) {
          il.template +=  `<tr style="border-bottom:1px dotted #999;padding:5px 0;text-align:center;">
             <td style="padding:7px 2px;">${el.name}</td>
             <td style="padding:7px 2px;">${el.quantity}</td></tr>`;
        }
      });*/
      th += `<tr style="border-bottom:1px dotted #999;padding:5px 0;text-align:center;">
             <td style="padding:7px 2px;">${el.name}</td>
             <td style="padding:7px 2px;">${el.orderQuantity}</td>
             <td style="padding:7px 2px;">${PrinterAction.currency$(el.unitPrice)}</td>
         </tr>`;
      // <td style="padding:7px 2px;">${PrinterAction.currency$(el.amount * el.quantity)}</td>
    });

    print_data = print_data.concat([
      {
        type: 'text',
        value: `<div style="min-height:275px;">
       <table style="width: 100%;display: table;border-collapse: collapse;border-spacing: 0;margin:15px 0;font-family:monospace, cursive;">
        <thead>
           <th>Item</th>
           <th>Qty</th>
           <th>Price</th>
       </thead>
        <tbody style="border-top:1px solid #999">
           ${th}
        </tbody>
        </table></div>`,
        style: `font-size: 14px;text-align:center;`
      },
      {
        type: 'text',
        value: `Total: ${PrinterAction.currency$(data.totalAmount, Directories.getAppConfig().company_currency)}`,
        style: `margin:25px 0 12px 0;padding: 10px 0;text-align:center;border-top:1px solid #999;border-bottom:1px solid #999;
        font-size: 17px;font-family:monospace, cursive;font-weight:bold`
      },
    ]);
    /**
     * Adding company logo
     * */
    if (Directories.getAppConfig().company_logo_url && fs.existsSync(Directories.RESOURCE_DIR + '/company_logo.png')) {
      print_data.unshift({type: 'image', path: Directories.RESOURCE_DIR + '/company_logo.png', value: '', position: 'center'});
    }
    /**
     *  encoding
     *
     *  */
    if (Directories.getAppConfig().print_encode_type === 'barCode') {
      print_data.push({
        type: 'barCode',
        width: 1,
        height: 42,
        position: 'center',
        value: Directories.getAppConfig().print_encode_text === 'invoiceNumber' ? data.invoiceNumber : Directories.getAppConfig().print_encode_text,
        displayValue: false
      });
    } else if (Directories.getAppConfig().print_encode_type === 'qrCode') {
      print_data.push({
        type: 'qrCode',
        width: 64,
        height: 64,
        position: 'right',
        value: Directories.getAppConfig().print_encode_text === 'invoiceNumber' ? data.invoiceNumber : Directories.getAppConfig().print_encode_text,
      });
    }
    // add message text
    print_data.push({
      type: 'text',
      value: Directories.getAppConfig().print_message.toLowerCase(),
      style: `text-align:center;font-size: 13px;font-family:monospace, cursive;margin-top: 25px;`
    });
    // printing....
    return new Promise<any>((resolve, reject) => {
      PosPrinter.print(print_data, {
          printerName: Directories.getAppConfig().printer_name,
          preview: true,
          width: 'auto',
      }).then(() => resolve()).catch((err) => reject(err));
    });
  }
  /**
   * @method
   * @name currency$
   * */
  public static currency$(value: number, code = null): string {
    if (code) {
      return new Intl.NumberFormat('en', { style: 'currency', currency: code }).format(value);
    }
    return new Intl.NumberFormat('en').format(value);
  }
}
