import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices-config.component.html',
  styleUrls: ['./invoices-config.component.scss']
})
export class InvoicesConfigComponent implements OnInit {
  assignWaiter: boolean;
  autocompleteSales: boolean;

  constructor(private config: SettingsService) {}

  ngOnInit() {
    this.assignWaiter = this.config.get('assign_waiter');
    this.autocompleteSales = this.config.get('autocomplete_sales');
  }

  saveSettings() {
    this.config.setKeys({assign_waiter: this.assignWaiter, autocomplete_sales: this.autocompleteSales});
  }
}
