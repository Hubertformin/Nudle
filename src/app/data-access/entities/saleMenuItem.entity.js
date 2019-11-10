"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
/*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
var typeorm_1 = require("typeorm");
var index_1 = require("./index");
var SaleMenuItem = /** @class */ (function (_super) {
    __extends(SaleMenuItem, _super);
    function SaleMenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryColumn()
    ], SaleMenuItem.prototype, "saleId");
    __decorate([
        typeorm_1.PrimaryColumn()
    ], SaleMenuItem.prototype, "menuItemId");
    __decorate([
        typeorm_1.Column()
    ], SaleMenuItem.prototype, "orderQuantity");
    __decorate([
        typeorm_1.Column()
    ], SaleMenuItem.prototype, "amount");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.SaleEntity; }, function (sale) { return sale.menuItemConnection; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'saleId' })
    ], SaleMenuItem.prototype, "sale");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.MenuItemEntity; }, function (mItem) { return mItem.saleConnection; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'menuItemId' })
    ], SaleMenuItem.prototype, "menuItem");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], SaleMenuItem.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], SaleMenuItem.prototype, "updatedAt");
    SaleMenuItem = __decorate([
        typeorm_1.Entity({ name: 'sale_menu_item' })
    ], SaleMenuItem);
    return SaleMenuItem;
}(typeorm_1.BaseEntity));
exports.SaleMenuItem = SaleMenuItem;
