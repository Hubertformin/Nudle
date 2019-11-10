"use strict";
/*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
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
var menu_category_entity_1 = require("./menu-category.entity");
var staff_entity_1 = require("./staff.entity");
var ingredient_entity_1 = require("./ingredient.entity");
var saleMenuItem_entity_1 = require("./saleMenuItem.entity");
var branch_entity_1 = require("./branch.entity");
var menu_reports_entity_1 = require("./menu-reports.entity");
var MenuItemEntity = /** @class */ (function (_super) {
    __extends(MenuItemEntity, _super);
    function MenuItemEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], MenuItemEntity.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], MenuItemEntity.prototype, "name");
    __decorate([
        typeorm_1.Column()
    ], MenuItemEntity.prototype, "unitPrice");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemEntity.prototype, "units");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemEntity.prototype, "posCode");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemEntity.prototype, "stackable");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemEntity.prototype, "quantity");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemEntity.prototype, "cookTime");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], MenuItemEntity.prototype, "procedureDescription");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return branch_entity_1.BranchEntity; }, function (branch) { return branch.staff; })
    ], MenuItemEntity.prototype, "branch");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return menu_category_entity_1.MenuCategoryEntity; }, function (mCategory) { return mCategory.menuItems; })
    ], MenuItemEntity.prototype, "category");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return staff_entity_1.StaffEntity; }, function (staff) { return staff.menuItems; })
    ], MenuItemEntity.prototype, "staff");
    __decorate([
        typeorm_1.OneToMany(function (type) { return ingredient_entity_1.IngredientEntity; }, function (ingredient) { return ingredient.menuItem; })
    ], MenuItemEntity.prototype, "ingredients");
    __decorate([
        typeorm_1.OneToMany(function (type) { return saleMenuItem_entity_1.SaleMenuItem; }, function (saleMenuItem) { return saleMenuItem.menuItem; })
    ], MenuItemEntity.prototype, "saleConnection");
    __decorate([
        typeorm_1.OneToMany(function (type) { return menu_reports_entity_1.MenuItemReportEntity; }, function (mReport) { return mReport.menuItem; })
    ], MenuItemEntity.prototype, "reportsConnection");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], MenuItemEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], MenuItemEntity.prototype, "updatedAt");
    MenuItemEntity = __decorate([
        typeorm_1.Entity({ name: 'menu_item' })
    ], MenuItemEntity);
    return MenuItemEntity;
}(typeorm_1.BaseEntity));
exports.MenuItemEntity = MenuItemEntity;
