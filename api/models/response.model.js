"use strict";
/*
 * Copyright (c) 2019. A production of Enchird-Tech (https://enchirdentity.com/privacy-policy),
 * all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 * */
exports.__esModule = true;
var ResponseMessage = /** @class */ (function () {
    function ResponseMessage(status, data, message) {
        if (status === void 0) { status = false; }
        if (data === void 0) { data = null; }
        if (message === void 0) { message = null; }
        this.status = status;
        this.data = data;
        this.message = message;
    }
    return ResponseMessage;
}());
exports.ResponseMessage = ResponseMessage;
