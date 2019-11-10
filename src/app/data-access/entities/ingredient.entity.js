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
var menu_item_entity_1 = require("./menu-item.entity");
var item_entity_1 = require("./item.entity");
var IngredientEntity = /** @class */ (function (_super) {
    __extends(IngredientEntity, _super);
    function IngredientEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryColumn()
    ], IngredientEntity.prototype, "menuItemId");
    __decorate([
        typeorm_1.PrimaryColumn()
    ], IngredientEntity.prototype, "itemId");
    __decorate([
        typeorm_1.Column('double')
    ], IngredientEntity.prototype, "quantity");
    __decorate([
        typeorm_1.Column()
    ], IngredientEntity.prototype, "units");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return menu_item_entity_1.MenuItemEntity; }, function (mItem) { return mItem.ingredients; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'menuItemId' })
    ], IngredientEntity.prototype, "menuItem");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return item_entity_1.ItemEntity; }, function (item) { return item.ingredients; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinTable({ name: 'menuItemId' })
    ], IngredientEntity.prototype, "item");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], IngredientEntity.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], IngredientEntity.prototype, "updatedAt");
    IngredientEntity = __decorate([
        typeorm_1.Entity({ name: 'ingredient' })
    ], IngredientEntity);
    return IngredientEntity;
}(typeorm_1.BaseEntity));
exports.IngredientEntity = IngredientEntity;
