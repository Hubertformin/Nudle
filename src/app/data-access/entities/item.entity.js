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
var ingredient_entity_1 = require("./ingredient.entity");
var itemStorage_entity_1 = require("./itemStorage.entity");
var itemSupplier_entity_1 = require("./itemSupplier.entity");
var ItemEntity = /** @class */ (function (_super) {
    __extends(ItemEntity, _super);
    function ItemEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], ItemEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], ItemEntity.prototype, "name");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ItemEntity.prototype, "unitCost");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ItemEntity.prototype, "minOrderQuantity");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ItemEntity.prototype, "units");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ItemEntity.prototype, "quantity");
    __decorate([
        typeorm_1.OneToMany(function (type) { return itemSupplier_entity_1.ItemToSupplier; }, function (supplier) { return supplier.item; })
    ], ItemEntity.prototype, "supplierConnection");
    __decorate([
        typeorm_1.OneToMany(function (type) { return itemStorage_entity_1.ItemToStorageArea; }, function (itemStorage) { return itemStorage.item; })
    ], ItemEntity.prototype, "storageAreaConnection");
    __decorate([
        typeorm_1.OneToMany(function (type) { return ingredient_entity_1.IngredientEntity; }, function (ingredient) { return ingredient.item; })
    ], ItemEntity.prototype, "ingredients");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], ItemEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], ItemEntity.prototype, "updatedAt");
    ItemEntity = __decorate([
        typeorm_1.Entity({ name: 'item' })
    ], ItemEntity);
    return ItemEntity;
}(typeorm_1.BaseEntity));
exports.ItemEntity = ItemEntity;
