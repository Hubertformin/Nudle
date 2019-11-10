"use strict";
/*
 * Copyright (c) 2019. A production of Enchird-Tech (https://enchirdentity.com/privacy-policy),
 * all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 * */
exports.__esModule = true;
var AppSettings = /** @class */ (function () {
    /**
     * @method
     * @name constructor
     * */
    function AppSettings() {
        this.language = 'en';
        this.theme = 'default-theme';
        this.company_id = 0;
        this.company_address = '';
        this.company_country = '';
        this.company_currency = '';
        this.company_city = '';
        this.company_state = '';
        this.company_name = 'Company\'s name';
        this.country_code = '';
        this.country_phone = '';
        this.company_phone = '';
        this.company_portal = '';
        this.company_website = '';
        this.company_email = '';
        this.company_logo_url = '';
        // this.branches = [];
        // this.default_branch_index = null;
        this.lightTheme = true;
        // printer
        this.printer_name = '';
        this.print_message = 'Thanks for your fidelity';
        this.print_preview = false;
        this.print_timeout_per_line = 400;
        this.print_encode_type = 'none';
        this.print_encode_text = '';
        // start up
        this.startup_url = 'point-of-sale';
        // sales
        this.assign_waiter = false;
        this.autocomplete_sales = true;
        this.applicationConfigured = false;
        // privacy
        this.usage_feedback = true;
        this.access_location = true;
    }
    return AppSettings;
}());
exports["default"] = AppSettings;
