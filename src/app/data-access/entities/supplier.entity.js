"use strict";
/*
 * Copyright (c) 2019. A production of Enchird-tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
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
var itemSupplier_entity_1 = require("./itemSupplier.entity");
/**
 * Co-dependent entities
 * **/
var SupplierEntity = /** @class */ (function (_super) {
    __extends(SupplierEntity, _super);
    function SupplierEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], SupplierEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], SupplierEntity.prototype, "name");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], SupplierEntity.prototype, "description");
    __decorate([
        typeorm_1.OneToMany(function (type) { return itemSupplier_entity_1.ItemToSupplier; }, function (itemSupp) { return itemSupp.supplier; })
    ], SupplierEntity.prototype, "supplierConnection");
    SupplierEntity = __decorate([
        typeorm_1.Entity({ name: 'supplier' })
    ], SupplierEntity);
    return SupplierEntity;
}(typeorm_1.BaseEntity));
exports.SupplierEntity = SupplierEntity;
