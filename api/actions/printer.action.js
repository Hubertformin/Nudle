"use strict";
exports.__esModule = true;
/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
var directories_module_1 = require("../modules/directories-module");
var electron_pos_printer_1 = require("electron-pos-printer");
var fs = require("fs");
var PrinterAction = /** @class */ (function () {
    function PrinterAction() {
    }
    /**
     * @method
     * @name printSale
     * */
    PrinterAction.printSale = function (data) {
        var d = new Date();
        var date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " ," + d.getHours() + ":" + d.getMinutes();
        var print_data = [
            /*{
              type: 'bodyInit',
              css: {
                'margin': '0 0 0 0',
                'width': '250px'
              }
            },*/
            {
                type: 'text',
                value: '<h1 style="margin-bottom: 0;">' + directories_module_1.Directories.getAppConfig().company_name + '</h1>',
                style: "font-family:monospace, cursive;text-align:center;font-weight:bold;"
            }, {
                type: 'text',
                value: "" + data.invoiceNumber + ((directories_module_1.Directories.getAppConfig().assign_waiter) ? ' - ' + data.waiter.firstName : ''),
                style: "text-align:center;font-size:0.7rem;font-weight:bold;margin: 2%;font-family:monospace, cursive;"
            },
            {
                type: 'text',
                value: date,
                style: "font-size: 11px;text-align:center;font-family:monospace, cursive;"
            }
        ];
        // Creating table
        var th = '';
        data.menuItems.forEach(function (el) {
            /*products.orderCategories.map((il) => {
              if (el.orderCategory === il.name) {
                il.template +=  `<tr style="border-bottom:1px dotted #999;padding:5px 0;text-align:center;">
                   <td style="padding:7px 2px;">${el.name}</td>
                   <td style="padding:7px 2px;">${el.quantity}</td></tr>`;
              }
            });*/
            th += "<tr style=\"border-bottom:1px dotted #999;padding:5px 0;text-align:center;\">\n             <td style=\"padding:7px 2px;\">" + el.name + "</td>\n             <td style=\"padding:7px 2px;\">" + el.orderQuantity + "</td>\n             <td style=\"padding:7px 2px;\">" + PrinterAction.currency$(el.unitPrice) + "</td>\n         </tr>";
            // <td style="padding:7px 2px;">${PrinterAction.currency$(el.amount * el.quantity)}</td>
        });
        print_data = print_data.concat([
            {
                type: 'text',
                value: "<div style=\"min-height:275px;\">\n       <table style=\"width: 100%;display: table;border-collapse: collapse;border-spacing: 0;margin:15px 0;font-family:monospace, cursive;\">\n        <thead>\n           <th>Item</th>\n           <th>Qty</th>\n           <th>Price</th>\n       </thead>\n        <tbody style=\"border-top:1px solid #999\">\n           " + th + "\n        </tbody>\n        </table></div>",
                style: "font-size: 14px;text-align:center;"
            },
            {
                type: 'text',
                value: "Total: " + PrinterAction.currency$(data.totalAmount, directories_module_1.Directories.getAppConfig().company_currency),
                style: "margin:25px 0 12px 0;padding: 10px 0;text-align:center;border-top:1px solid #999;border-bottom:1px solid #999;\n        font-size: 17px;font-family:monospace, cursive;font-weight:bold"
            },
        ]);
        /**
         * Adding company logo
         * */
        if (directories_module_1.Directories.getAppConfig().company_logo_url && fs.existsSync(directories_module_1.Directories.RESOURCE_DIR + '/company_logo.png')) {
            print_data.unshift({ type: 'image', path: directories_module_1.Directories.RESOURCE_DIR + '/company_logo.png', value: '', position: 'center' });
        }
        /**
         *  encoding
         *
         *  */
        if (directories_module_1.Directories.getAppConfig().print_encode_type === 'barCode') {
            print_data.push({
                type: 'barCode',
                width: 1,
                height: 42,
                position: 'center',
                value: directories_module_1.Directories.getAppConfig().print_encode_text === 'invoiceNumber' ? data.invoiceNumber : directories_module_1.Directories.getAppConfig().print_encode_text,
                displayValue: false
            });
        }
        else if (directories_module_1.Directories.getAppConfig().print_encode_type === 'qrCode') {
            print_data.push({
                type: 'qrCode',
                width: 64,
                height: 64,
                position: 'right',
                value: directories_module_1.Directories.getAppConfig().print_encode_text === 'invoiceNumber' ? data.invoiceNumber : directories_module_1.Directories.getAppConfig().print_encode_text
            });
        }
        // add message text
        print_data.push({
            type: 'text',
            value: directories_module_1.Directories.getAppConfig().print_message.toLowerCase(),
            style: "text-align:center;font-size: 13px;font-family:monospace, cursive;margin-top: 25px;"
        });
        // printing....
        return new Promise(function (resolve, reject) {
            electron_pos_printer_1.PosPrinter.print(print_data, {
                printerName: directories_module_1.Directories.getAppConfig().printer_name,
                preview: true,
                width: 'auto'
            }).then(function () { return resolve(); })["catch"](function (err) { return reject(err); });
        });
    };
    /**
     * @method
     * @name currency$
     * */
    PrinterAction.currency$ = function (value, code) {
        if (code === void 0) { code = null; }
        if (code) {
            return new Intl.NumberFormat('en', { style: 'currency', currency: code }).format(value);
        }
        return new Intl.NumberFormat('en').format(value);
    };
    return PrinterAction;
}());
exports.PrinterAction = PrinterAction;
