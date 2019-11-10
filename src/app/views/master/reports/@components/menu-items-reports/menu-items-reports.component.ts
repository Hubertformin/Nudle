import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DbService} from '../../../../../providers/db.service';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import {ReportsModel} from '../../../../../data-access/entities';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../../../../providers/settings.service';
import {ExportService} from '../../../../../providers/export.service';

@Component({
  selector: 'app-menu-items-reports',
  templateUrl: './menu-items-reports.component.html',
  styleUrls: ['./menu-items-reports.component.scss']
})
export class MenuItemsReportsComponent implements OnInit, OnChanges {
  @Input() startDate: string;
  @Input() endDate: string;
  // menuCategories
  menuCategories: any[];
  menuItems: any[];
  // selected menu item to display on right pane
  selectedMenuItem =  {
    item: null,
    range: {begin: null, endDate: null},
    lineChartData: [{ data: [], label: '', yAxisID: 'y-axis-1' }],
    lineChartLabels: []
  };
  // most order items
  mostOrderedItems: any[];

  public lineChartOptions: ChartOptions = {
    responsive: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{id: 'x-axis-1', scaleLabel: {labelString: 'DATE'}}],
      yAxes: [
        {
          id: 'y-axis-1',
          scaleLabel: {labelString: 'AMOUNT(' + this.config.getAllConfig().company_currency + ')'}
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(203,61,54,0.23)',
      borderColor: 'rgba(203,61,54,1)',
      pointBackgroundColor: 'rgb(177,73,44)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(177,132,27,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  /**
   *  ======================== PIE CHART =============
   * **/
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private db: DbService, public config: SettingsService, private exportService: ExportService) { }

  ngOnInit() {
    // get reports
    this.db.getReports()
      .then((reports) => {
        this.renderReports(reports);
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.endDate && this.endDate) || (changes.startDate && this.startDate)) {
      // get menu categories and items by date changes
      this.db.getReportsByDate(this.startDate, this.endDate)
        .then((reports) => {
          this.renderReports(reports);
        });
    } else {
      // get all reports..
      this.db.getReports()
        .then((reports) => {
          this.renderReports(reports);
        });
    }
  }
  /**
   *  CHARTS
   * **/

  // events
  public chartClicked({ event }: { event: MouseEvent }): void {
    console.log(event);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  /*public changeLabel() {
    // this.lineChartLabels[2] = ['1st Line', '2nd Line'];
    // this.chart.update();
  }
  public getRandomColor(num = 1) {
    return (num === 1) ? Core.getRandomColor(num)[0] : Core.getRandomColor(num);
  }*/
  /**
   * @method
   * @name previewMenuItem
   * @description render menu item statistics on the right pane.
   * **/
  previewMenuItem(index: number) {
    // get item
    const item = this.menuItems[index];
    // get item to selected item
    this.selectedMenuItem.item = item;
    this.selectedMenuItem.lineChartData[0].label = item.name.toLowerCase();
    // resetting data-sets and labels
    this.selectedMenuItem.lineChartData[0].data = item.chartData;
    this.selectedMenuItem.lineChartLabels = item.chartLabels;
    this.chart.update();
  }
  /**
   * @method
   * @name exportData
   * */
  exportData(type: string) {
    this.exportService.openDialog(this.startDate, this.endDate, type);
  }

  private renderReports(reports: ReportsModel[]) {
    // reseting data...
    this.menuCategories = [];
    this.menuItems = [];
    this.pieChartData = [];
    this.pieChartLabels = [];
    // generating reports
    reports.forEach(rp => {
      // categories
      rp.menuCategoryConnection.forEach(mc => {
        // increment if data already exist in menu category array
        const exist_index = this.menuCategories.findIndex(tc => tc.name === mc.menuCategory.name);
        if (exist_index > -1) {
          // increment this.menuCategories[exist_index] values
          this.menuCategories[exist_index].amount += Number(mc.amount);
          // increment pieChart data at specified index
          this.pieChartData[exist_index] += Number(mc.amount);
        } else {
          this.menuCategories.push({name: mc.menuCategory.name, amount: Number(mc.amount)});
          // pie char data
          this.pieChartLabels.push(mc.menuCategory.name);
          this.pieChartData.push(mc.amount);
        }
      });
      // menu items
      rp.menuItemConnection.forEach(mI => {
        const _exist_index = this.menuItems.findIndex(el => el.name === mI.menuItem.name);
        if (_exist_index > -1) {
          this.menuItems[_exist_index].amount += Number(mI.amount);
          this.menuItems[_exist_index].orderQuantity += mI.orderQuantity;
          // line chart data
          this.menuItems[_exist_index].chartLabels.push(new DatePipe('en-GB').transform(rp.createdAt, 'dd-MM-yy'));
          this.menuItems[_exist_index].chartData.push(mI.orderQuantity);
        } else {
          this.menuItems.push({
            name: mI.menuItem.name,
            amount: Number(mI.amount),
            orderQuantity: mI.orderQuantity,
            chartLabels: [new DatePipe('en-GB').transform(rp.createdAt, 'dd-MM-yy')],
            chartData: [mI.orderQuantity]
          });
        }
      });
    });
    // generate pieChart colors
    this.pieChartColors = [
      {backgroundColor: this.getRandomColor(this.menuCategories.length)},
    ];
    // sort array in order of most ordered...
    this.menuItems =
      this.menuItems.sort((a, b) => (a.orderQuantity < b.orderQuantity) ? 1 : ((b.orderQuantity > a.orderQuantity) ? -1 : 0));
    this.mostOrderedItems = this.menuItems.slice(0, 4);
  }

  private getRandomColor(length: number): string[] {
    const colors = [];
    for (let j = 0; j <= length; j++) {
      const _letter = '0123456789'.split('');
      let _color = '#';
      for (let i = 0; i < 6; i++) {
        _color += _letter[Math.floor(Math.random() * 10)];
      }
      colors.push(_color);
    }
    return colors;
  }
}

