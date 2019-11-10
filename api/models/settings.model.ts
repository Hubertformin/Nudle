/*
 * Copyright (c) 2019. A production of Enchird-Tech (https://enchirdentity.com/privacy-policy),
 * all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 * */

export interface SettingsModel {
  company_name?: string;
  company_state?: string;
  company_city?: string;
  company_address?: string;
  company_country?: string;
  company_currency?: string;
  language?: string;
  theme?: string;
  lightTheme?: boolean;
  company_id?: number;
  country_code?: string;
  country_phone?: string;
  company_phone?: string;
  company_website?: string;
  company_portal?: string;
  company_email?: string;
  company_logo_url?: string;
  // printer settings
  printer_name?: string;
  print_preview?: boolean;
  print_timeout_per_line?: number;
  print_message?: string;
  // print encode type: barcode | qr-code | none
  print_encode_type?: string;
  print_encode_text?: string;
  // start up
  startup_url?: string;
  // sales and invoices
  assign_waiter?: boolean;
  autocomplete_sales?: boolean;
  // branches
  // branches: CompanyBranchModel[];
  // default_branch_index: number;
  // tables and assets
  // tables: MenuTableModel[];
  // privacy settings
  usage_feedback?: boolean;
  access_location?: boolean;
  /**
   * set up config
   * */
  applicationConfigured?: boolean;
}
export interface CompanyBranchModel {
  branch_id: number;
  branch_name: string;
  branch_location: string;
  isDefault: boolean;
}
// country interface
interface Country {
  capital: string;
  continent: string;
  currency: string;
  emoji: string;
  emojiU: string;
  languages: string[];
  name: string;
  native: string;
  phone: string;
  states: object;
}

export default class AppSettings implements SettingsModel {
  company_address: string;
  company_country: string;
  company_currency: string;
  company_name: string;
  language: string;
  theme: string;
  company_id: number;
  company_city: string;
  company_state: string;
  country_code: string;
  country_phone: string;
  company_phone: string;
  company_portal: string;
  company_website: string;
  company_email: string;
  company_logo_url: string;
  // branches: CompanyBranchModel[];
  // default_branch_index: number;
  lightTheme: boolean;
  // printer
  print_message: string;
  print_preview: boolean;
  print_timeout_per_line: number;
  printer_name: string;
  print_encode_type: string;
  print_encode_text: string;
  // startup
  startup_url: string;
  // sales
  assign_waiter: boolean;
  autocomplete_sales: boolean;
  applicationConfigured: boolean;
  // privacy
  usage_feedback: boolean;
  access_location: boolean;
  /**
   * @method
   * @name constructor
   * */
  constructor() {
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
}
