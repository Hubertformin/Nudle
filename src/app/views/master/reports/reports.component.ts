import {Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {DbService} from '../../../providers/db.service';
import {ReportsModel} from '../../../data-access/entities';
import {faChartPie} from '@fortawesome/free-solid-svg-icons';
import {SettingsService} from '../../../providers/settings.service';
import {MatSelectChange} from '@angular/material';
import {SatDatepickerInputEvent} from 'saturn-datepicker';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnChanges {
  globalReports: ReportsModel;
  reportsIcon = faChartPie;
  showDatePicker = false;
  startDate: string;
  endDate: string;

  constructor(private db: DbService, public config: SettingsService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.db.getReports()
      .then(data => {
        this.renderReports(data);
        console.log(data)
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  onDateFilterChange(event: MatSelectChange) {
    const date = new Date();
    switch (event.value) {
      case 'all':
        this.startDate = null;
        this.endDate = null;
        break;
      case 'today':
        this.startDate = date.toISOString();
        this.endDate = date.toISOString();
        break;
      case 'this-week':
        const day = date.getDay() > 0 ? date.getDay() - 1 : 6;
        const week_start = moment().subtract(day, 'days').format('YYYY-MM-DD');
        // assigning dates
        this.startDate = week_start;
        this.endDate = date.toISOString();
        break;
      case 'this-month':
        const day1 = date.getDate() - 1;
        const month_start = moment().subtract(day1, 'days').format('YYYY-MM-DD');
        const end_1 = moment().format('YYYY-MM-DD');
        // settings the time on dates
        this.startDate = month_start;
        this.endDate = date.toISOString();
        break;
      default:
        this.showDatePicker = true;
        return;
    }
    // get reports
    if (this.startDate && this.endDate) {
      this.db.getReportsByDate(this.startDate, this.endDate)
        .then(reports => {
          this.renderReports(reports);
        });
    } else {
      // get all reports
      this.db.getReports()
        .then(data => {
          this.renderReports(data);
        });
    }
  }

  onDateSelected(event: SatDatepickerInputEvent<unknown>) {
    console.log(event);
    this.startDate = (event.value as any).begin.toISOString();
    this.endDate = (event.value as any).end.toISOString();
    // get reports
    const repDate$ = this.db.getReportsByDate(this.startDate, this.endDate)
      .then(data => {
        this.renderReports(data);
      });
  }


  private renderReports(data: ReportsModel[]) {
    // hide "no records" placeholder
    const _placeholder = $('#noRecordsPlaceholder');
    _placeholder.fadeOut('fast');
    // if data is found
    console.log('debug: 01');
    if (data.length > 0 && !(this.startDate && this.endDate)) {
      this.globalReports = data.find(rp => rp.dateId === 'GLOBAL');
      console.log(this.globalReports);

    } else if (data.length > 0 && (this.startDate && this.endDate)) {

      this.globalReports = {grossProfits: 0, totalExpenses: 0, averageDailySales: 0};
      data.forEach(rp => {
        if (rp.dateId !== 'GLOBAL') {
          this.globalReports.grossProfits += rp.grossProfits;
          this.globalReports.totalExpenses += rp.totalExpenses;
          this.globalReports.totalExpenses += rp.totalExpenses;
          this.globalReports.averageDailySales += rp.averageDailySales;
        }
      });
      // compute overall average
      this.globalReports.averageDailySales = this.globalReports.averageDailySales / data.length;
    } else {
      // show no records placeholder
      _placeholder.fadeIn('fast');
    }
  }
}
