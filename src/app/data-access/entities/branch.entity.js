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
 * Copyright (c) 2019. A production of Enchird, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 */
var typeorm_1 = require("typeorm");
var staff_group_entity_1 = require("./staff-group.entity");
var staff_entity_1 = require("./staff.entity");
var menu_item_entity_1 = require("./menu-item.entity");
var menu_category_entity_1 = require("./menu-category.entity");
var sale_entity_1 = require("./sale.entity");
var expense_entity_1 = require("./expense.entity");
var waste_event_entity_1 = require("./waste-event.entity");
var BranchEntity = /** @class */ (function (_super) {
    __extends(BranchEntity, _super);
    function BranchEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryColumn()
    ], BranchEntity.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], BranchEntity.prototype, "name");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], BranchEntity.prototype, "location");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], BranchEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], BranchEntity.prototype, "updatedAt");
    __decorate([
        typeorm_1.OneToMany(function (type) { return staff_group_entity_1.StaffGroupEntity; }, function (sGroup) { return sGroup.branch; })
    ], BranchEntity.prototype, "staffGroups");
    __decorate([
        typeorm_1.OneToMany(function (type) { return staff_entity_1.StaffEntity; }, function (staff) { return staff.branch; })
    ], BranchEntity.prototype, "staff");
    __decorate([
        typeorm_1.OneToMany(function (type) { return menu_item_entity_1.MenuItemEntity; }, function (mItem) { return mItem.branch; })
    ], BranchEntity.prototype, "menuItems");
    __decorate([
        typeorm_1.OneToMany(function (type) { return menu_category_entity_1.MenuCategoryEntity; }, function (mCategory) { return mCategory.branch; })
    ], BranchEntity.prototype, "menuCategories");
    __decorate([
        typeorm_1.OneToMany(function (type) { return sale_entity_1.SaleEntity; }, function (sale) { return sale.branch; })
    ], BranchEntity.prototype, "sales");
    __decorate([
        typeorm_1.OneToMany(function (type) { return expense_entity_1.ExpenseEntity; }, function (sale) { return sale.branch; })
    ], BranchEntity.prototype, "expenses");
    __decorate([
        typeorm_1.OneToMany(function (type) { return waste_event_entity_1.WasteEventEntity; }, function (event) { return event.branch; })
    ], BranchEntity.prototype, "wasteEvents");
    BranchEntity = __decorate([
        typeorm_1.Entity({ name: 'branch' })
    ], BranchEntity);
    return BranchEntity;
}(typeorm_1.BaseEntity));
exports.BranchEntity = BranchEntity;
