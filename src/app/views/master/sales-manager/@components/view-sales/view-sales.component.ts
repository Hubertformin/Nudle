import {Component, Input, OnInit} from '@angular/core';
import {SaleEntity} from '../../../../../data-access/entities';
import {SettingsService} from '../../../../../providers/settings.service';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.scss']
})
export class ViewSalesComponent implements OnInit {
  @Input() saleItem: SaleEntity;

  constructor(private config: SettingsService) { }

  ngOnInit() {
    console.log(this.saleItem);
  }

  get currency() {
    return this.config.get('company_currency');
  }

  get company_name() {
    return this.config.get('company_name');
  }
  get app_config() {
    return this.config.getAllConfig();
  }

}
