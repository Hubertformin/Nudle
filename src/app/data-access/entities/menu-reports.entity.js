"use strict";
/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
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
var typeorm_1 = require("typeorm");
var index_1 = require("./index");
var MenuItemReportEntity = /** @class */ (function (_super) {
    __extends(MenuItemReportEntity, _super);
    function MenuItemReportEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryColumn()
    ], MenuItemReportEntity.prototype, "reportId");
    __decorate([
        typeorm_1.PrimaryColumn()
    ], MenuItemReportEntity.prototype, "menuItemId");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemReportEntity.prototype, "amount");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemReportEntity.prototype, "orderQuantity");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.MenuItemEntity; }, function (item) { return item.reportsConnection; }, { onDelete: 'SET NULL' }),
        typeorm_1.JoinTable({ name: 'menuItemId' })
    ], MenuItemReportEntity.prototype, "menuItem");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.ReportsEntity; }, function (report) { return report.menuItemConnection; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'reportId' })
    ], MenuItemReportEntity.prototype, "report");
    MenuItemReportEntity = __decorate([
        typeorm_1.Entity({ name: 'menu_item_report' })
    ], MenuItemReportEntity);
    return MenuItemReportEntity;
}(typeorm_1.BaseEntity));
exports.MenuItemReportEntity = MenuItemReportEntity;
var MenuCategoryReportsEntity = /** @class */ (function (_super) {
    __extends(MenuCategoryReportsEntity, _super);
    function MenuCategoryReportsEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryColumn()
    ], MenuCategoryReportsEntity.prototype, "reportId");
    __decorate([
        typeorm_1.PrimaryColumn()
    ], MenuCategoryReportsEntity.prototype, "menuCategoryId");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuCategoryReportsEntity.prototype, "amount");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuCategoryReportsEntity.prototype, "orderQuantity");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.MenuCategoryEntity; }, function (mCat) { return mCat.reportsConnection; }, { onDelete: 'SET NULL' }),
        typeorm_1.JoinTable({ name: 'menuCategoryId' })
    ], MenuCategoryReportsEntity.prototype, "menuCategory");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.ReportsEntity; }, function (report) { return report.menuCategoryConnection; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'reportId' })
    ], MenuCategoryReportsEntity.prototype, "report");
    MenuCategoryReportsEntity = __decorate([
        typeorm_1.Entity({ name: 'menu_category_report' })
    ], MenuCategoryReportsEntity);
    return MenuCategoryReportsEntity;
}(typeorm_1.BaseEntity));
exports.MenuCategoryReportsEntity = MenuCategoryReportsEntity;
