"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_SETTINGS = '[SETTINGS] UPDATE';
exports.RESET_SETTINGS = '[SETTINGS] RESET';
var UpdateSettings = /** @class */ (function () {
    function UpdateSettings(payload) {
        this.payload = payload;
        this.type = exports.UPDATE_SETTINGS;
    }
    return UpdateSettings;
}());
exports.UpdateSettings = UpdateSettings;
var ResetSettings = /** @class */ (function () {
    function ResetSettings() {
        this.type = exports.RESET_SETTINGS;
    }
    return ResetSettings;
}());
exports.ResetSettings = ResetSettings;
//# sourceMappingURL=app.actions.js.map