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
// Intermediary table for storage areas and Item
var typeorm_1 = require("typeorm");
var storage_area_entity_1 = require("./storage-area.entity");
var item_entity_1 = require("./item.entity");
var ItemToStorageArea = /** @class */ (function (_super) {
    __extends(ItemToStorageArea, _super);
    function ItemToStorageArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryColumn()
    ], ItemToStorageArea.prototype, "itemId");
    __decorate([
        typeorm_1.PrimaryColumn()
    ], ItemToStorageArea.prototype, "storageAreaId");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], ItemToStorageArea.prototype, "quantity");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return item_entity_1.ItemEntity; }, function (item) { return item.storageAreaConnection; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'itemId' })
    ], ItemToStorageArea.prototype, "item");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return storage_area_entity_1.StorageAreaEntity; }, function (storage) { return storage.itemConnection; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'storageAreaId' })
    ], ItemToStorageArea.prototype, "storageArea");
    ItemToStorageArea = __decorate([
        typeorm_1.Entity()
    ], ItemToStorageArea);
    return ItemToStorageArea;
}(typeorm_1.BaseEntity));
exports.ItemToStorageArea = ItemToStorageArea;
