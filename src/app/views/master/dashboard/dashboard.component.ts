// import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
// import {faCaretDown, faCaretUp, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
// import {SettingsService} from '../../../providers/settings.service';
// import {DbService} from '../../../providers/db.service';
// import {ItemModel, MenuItemModel, ReportsModel} from '../../../data-access/entities';
// import {BaseChartDirective, Color, Label} from 'ng2-charts';
// import {ChartDataSets, ChartOptions} from 'chart.js';
// import {DatePipe} from '@angular/common';
//
// // chart
// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent implements OnInit, AfterViewInit {
//   months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   // line chart data
//   public lineChartData: ChartDataSets[] = [
//     { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Gross Profits', yAxisID: 'y-axis-0' },
//     { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Expenses', yAxisID: 'y-axis-1' }
//   ];
//   public lineChartLabels: Label[] = this.months;
//   public lineChartOptions: ChartOptions = {
//     responsive: false,
//     maintainAspectRatio: true,
//     scales: {
//       // We use this empty structure as a placeholder for dynamic theming.
//       xAxes: [{}],
//       yAxes: [{
//          id: 'y-axis-0',
//          position: 'left',
//         /*gridLines: {
//           color: 'rgba(0,225,80,0.3)',
//         },*/
//          ticks: {
//            fontColor: 'green',
//          }
//         },
//         {
//           id: 'y-axis-1',
//           position: 'right',
//           /*gridLines: {
//             color: 'rgba(255,0,0,0.3)',
//           },*/
//           ticks: {
//             fontColor: 'red',
//           }
//         }
//       ]
//     }
//   };
//   public lineChartColors: Color[] = [
//     { // grey
//       backgroundColor: 'rgba(0,104,55,0.8)',
//       borderColor: 'rgba(0,104,55,1)',
//       pointBackgroundColor: 'rgba(0,104,55,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: 'rgba(0,104,55,1)',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     },
//     { // red
//       backgroundColor: 'rgba(204,31,26,0.8)',
//       borderColor: 'rgba(204,31,26,0.8)',
//       pointBackgroundColor: 'rgba(204, 31, 26, 1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: 'rgba(204,31,26,0.8)',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     }
//   ];
//   public lineChartLegend = true;
//
//   @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
//
//   dropIcon = faCaretDown;
//   upIcon = faCaretUp;
//   warnIcon = faExclamationTriangle;
//   name: any;
//   selected: any;
//   todayReports: ReportsModel;
//   yesterdayReports: ReportsModel;
//   globalReports: ReportsModel;
//   reports: ReportsModel[];
//   // inventory and menu Items
//   lowInventoryItems: ItemModel[] = [];
//   lowMenuItems: MenuItemModel[] = [];
//
//   constructor(private config: SettingsService, private db: DbService) { }
//
//   ngOnInit() {
//     this.db.getReports()
//       .then(reports => {
//         this.reports = reports;
//         this.globalReports = reports.find(rp => rp.dateId === 'GLOBAL');
//         this.todayReports = reports[reports.length - 1];
//         this.yesterdayReports = reports[reports.length - 2];
//         // generate chart data
//         this.generateChartData();
//       });
//   }
//
//   ngAfterViewInit(): void {
//     this.db.getAllStaff()
//       .then(data => {
//         // console.log(data);
//       }, (err) => {
//         console.log(err);
//       });
//     // get low stock menu and inventory items
//     this.db.getAllMenuItems()
//       .then((rows) => {
//         this.lowMenuItems = rows.filter(row => row.stackable && row.quantity < 15);
//       });
//     // get low inventory items
//     this.db.getAllInventoryItems()
//       .then((rows) => {
//         this.lowInventoryItems = rows.filter(row => row.minOrderQuantity ? row.quantity <= row.minOrderQuantity : row.quantity < 5);
//       });
//   }
//   /**
//    * @name getters
//    * */
//   get currency() {
//     return this.config.get('company_currency');
//   }
//
//   getProfits(a: ReportsModel) {
//     return a.grossProfits - a.totalExpenses;
//   }
//   percentage_change(_old: number, _new: number): number {
//     if (_old === 0 && _new !== 0) {
//       return 100;
//     }
//     if (_old === 0 && _new === 0) {
//       return 0;
//     }
//     return Math.round(((_new - _old) / (Math.abs(_old))) * 100);
//   }
//
//   generateChartData() {
//     // if reports data is less than two months of records
//     if (this.reports.length < 62) {
//       this.lineChartLabels = [];
//       this.lineChartData[0].data = [];
//       this.lineChartData[1].data = [];
//       this.lineChartLabels = this.reports.filter(rp => rp.dateId !== 'GLOBAL').map(rp => new DatePipe('en-GB').transform(rp.createdAt, 'dd-MM-yy'));
//       this.lineChartData[0].data =  this.reports.filter(rp => rp.dateId !== 'GLOBAL').map(rp => rp.grossProfits).slice(0, 10);
//       this.lineChartData[1].data =  this.reports.filter(rp => rp.dateId !== 'GLOBAL').map(rp => rp.totalExpenses).slice(0, 10);
//     } else {
//       // if reports exceeds 62 days
//       this.reports.forEach(rp => {
//         if (rp.dateId !== 'GLOBAL') {
//           (this.lineChartData[0].data[new Date(rp.createdAt).getMonth()] as number) += rp.grossProfits;
//           (this.lineChartData[1].data[new Date(rp.createdAt).getMonth()] as number) += rp.totalExpenses;
//         }
//       });
//     }
//     // update chart
//     this.chart.update();
//   }
//
//   chartClicked($event: { event?: MouseEvent; active?: {}[] }) {
//
//   }
//
//   chartHovered($event: { event: MouseEvent; active: {}[] }) {
//
//   }
// }
