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
var ExpenseEntity = /** @class */ (function (_super) {
    __extends(ExpenseEntity, _super);
    function ExpenseEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], ExpenseEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ExpenseEntity.prototype, "category");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ExpenseEntity.prototype, "description");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ExpenseEntity.prototype, "frequency");
    __decorate([
        typeorm_1.Column()
    ], ExpenseEntity.prototype, "amount");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return branch_entity_1.BranchEntity; }, function (branch) { return branch.staff; })
    ], ExpenseEntity.prototype, "branch");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return index_1.StaffEntity; }, function (staff) { return staff.expenses; })
    ], ExpenseEntity.prototype, "staff");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], ExpenseEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], ExpenseEntity.prototype, "updatedAt");
    ExpenseEntity = __decorate([
        typeorm_1.Entity({ name: 'expense' })
    ], ExpenseEntity);
    return ExpenseEntity;
}(typeorm_1.BaseEntity));
exports.ExpenseEntity = ExpenseEntity;
