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
var branch_entity_1 = require("./branch.entity");
var SaleEntity = /** @class */ (function (_super) {
    __extends(SaleEntity, _super);
    function SaleEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], SaleEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], SaleEntity.prototype, "invoiceNumber");
    __decorate([
        typeorm_1.Column()
    ], SaleEntity.prototype, "totalAmount");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], SaleEntity.prototype, "discount");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], SaleEntity.prototype, "tableId");
    __decorate([
        typeorm_1.Column({ "default": true })
    ], SaleEntity.prototype, "completed");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return branch_entity_1.BranchEntity; }, function (branch) { return branch.staff; })
    ], SaleEntity.prototype, "branch");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.StaffEntity; }, function (staff) { return staff.issuedSales; }, { onDelete: 'SET NULL' })
    ], SaleEntity.prototype, "cashier");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.StaffEntity; }, function (staff) { return staff.receivedSales; }, { onDelete: 'SET NULL' })
    ], SaleEntity.prototype, "waiter");
    __decorate([
        typeorm_1.OneToMany(function (type) { return index_1.SaleMenuItem; }, function (saleMenuItem) { return saleMenuItem.sale; })
    ], SaleEntity.prototype, "menuItemConnection");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], SaleEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], SaleEntity.prototype, "updatedAt");
    SaleEntity = __decorate([
        typeorm_1.Entity({ name: 'sale' })
    ], SaleEntity);
    return SaleEntity;
}(typeorm_1.BaseEntity));
exports.SaleEntity = SaleEntity;
