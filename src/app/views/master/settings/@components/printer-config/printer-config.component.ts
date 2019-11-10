/*
 * Copyright (c) 2019. A production of Enchird-Tech (https://enchirdentity.com/privacy-policy),
 * all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 * */

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatRadioChange} from '@angular/material';
import {ElectronService} from '../../../../../providers/electron.service';

interface PrinterInfo {
  // Docs: http://electronjs.org/docs/api/structures/printer-info
  description: string;
  isDefault: boolean;
  name: string;
  status: number;
}

@Component({
  selector: 'app-printer',
  templateUrl: './printer-config.component.html',
  styleUrls: ['./printer-config.component.scss']
})
export class PrinterConfigComponent implements OnInit, AfterViewInit {
  printersList: PrinterInfo[];
  formGroup: FormGroup;

  constructor(private electron: ElectronService, public config: SettingsService, private _fb: FormBuilder) { }

  ngOnInit() {
    // init form
    this.formGroup = this._fb.group({
      defaultPrinterName: [this.config.get('printer_name')],
      timeOut: [this.config.get('print_timeout_per_line')],
      preview: [this.config.get('print_preview')],
      printEncodeType: [this.config.get('print_encode_type')],
      printEncodeText: [this.config.get('print_encode_text')],
      printMessage: [this.config.get('print_message')]
    });
    // console.log(this.config.getAllConfig());
    // console.log(this.formGroup.value);
    // get printers list from main process..
    this.printersList = JSON.parse(this.electron.ipcRenderer.sendSync('get-printers'));
  }
  ngAfterViewInit(): void {
  }

  updateSettings() {
    this.config.setKeys({
      printer_name: this.formGroup.get('defaultPrinterName').value,
      print_preview: this.formGroup.get('preview').value,
      print_timeout_per_line: this.formGroup.get('timeOut').value,
      print_encode_type: this.formGroup.get('printEncodeType').value,
      print_encode_text: this.formGroup.get('printEncodeText').value,
      print_message: this.formGroup.get('printMessage').value
    });
    console.log(this.config.getAllConfig());
  }

  get encode_type() {
    return this.formGroup.get('printEncodeType').value;
  }

  get company_name() {
    return this.config.get('company_name');
  }

  get company_website() {
    return this.config.get('company_website');
  }

  onSelectEncoding(event: MatRadioChange) {
    this.updateSettings();
  }
}
