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
var class_validator_1 = require("class-validator");
var staff_group_entity_1 = require("./staff-group.entity");
var menu_item_entity_1 = require("./menu-item.entity");
var waste_event_entity_1 = require("./waste-event.entity");
var sale_entity_1 = require("./sale.entity");
var expense_entity_1 = require("./expense.entity");
var branch_entity_1 = require("./branch.entity");
var StaffEntity = /** @class */ (function (_super) {
    __extends(StaffEntity, _super);
    function StaffEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], StaffEntity.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], StaffEntity.prototype, "firstName");
    __decorate([
        typeorm_1.Column()
    ], StaffEntity.prototype, "lastName");
    __decorate([
        typeorm_1.Column({ "default": true })
    ], StaffEntity.prototype, "isActive");
    __decorate([
        typeorm_1.Column({ "default": false })
    ], StaffEntity.prototype, "isManager");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], StaffEntity.prototype, "userName");
    __decorate([
        typeorm_1.Column({
            type: 'varchar',
            length: 150,
            unique: true,
            nullable: true
        }),
        class_validator_1.IsEmail()
    ], StaffEntity.prototype, "email");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], StaffEntity.prototype, "password");
    __decorate([
        typeorm_1.Column({
            type: 'varchar',
            length: 20,
            nullable: true
        })
    ], StaffEntity.prototype, "phoneNumber");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], StaffEntity.prototype, "gender");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], StaffEntity.prototype, "age");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], StaffEntity.prototype, "salary");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], StaffEntity.prototype, "contractType");
    __decorate([
        typeorm_1.Column({ type: 'simple-array', nullable: true })
    ], StaffEntity.prototype, "workShift");
    __decorate([
        typeorm_1.Column({ type: 'simple-json', nullable: true })
    ], StaffEntity.prototype, "imageUrl");
    __decorate([
        typeorm_1.Column({ type: 'simple-json', nullable: true })
    ], StaffEntity.prototype, "resumeUrl");
    __decorate([
        typeorm_1.Column({ type: 'simple-json', nullable: true })
    ], StaffEntity.prototype, "permissions");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return staff_group_entity_1.StaffGroupEntity; }, function (sGroup) { return sGroup.staff; })
    ], StaffEntity.prototype, "group");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return branch_entity_1.BranchEntity; }, function (branch) { return branch.staff; })
    ], StaffEntity.prototype, "branch");
    __decorate([
        typeorm_1.OneToMany(function (type) { return menu_item_entity_1.MenuItemEntity; }, function (mItem) { return mItem.staff; })
    ], StaffEntity.prototype, "menuItems");
    __decorate([
        typeorm_1.OneToMany(function (type) { return waste_event_entity_1.WasteEventEntity; }, function (wEvent) { return wEvent.staff; })
    ], StaffEntity.prototype, "wasteEvents");
    __decorate([
        typeorm_1.OneToMany(function (type) { return sale_entity_1.SaleEntity; }, function (sales) { return sales.cashier; })
    ], StaffEntity.prototype, "issuedSales");
    __decorate([
        typeorm_1.OneToMany(function (type) { return sale_entity_1.SaleEntity; }, function (sales) { return sales.waiter; })
    ], StaffEntity.prototype, "receivedSales");
    __decorate([
        typeorm_1.OneToMany(function (type) { return expense_entity_1.ExpenseEntity; }, function (expense) { return expense.staff; })
    ], StaffEntity.prototype, "expenses");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], StaffEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], StaffEntity.prototype, "updatedAt");
    StaffEntity = __decorate([
        typeorm_1.Entity({ name: 'staff' })
    ], StaffEntity);
    return StaffEntity;
}(typeorm_1.BaseEntity));
exports.StaffEntity = StaffEntity;
