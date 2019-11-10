import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {SettingsService} from './settings.service';
import {ReportsEntity, ReportsModel} from '../data-access/entities';
import {DbService} from './db.service';
import {DatePipe} from '@angular/common';

import * as $ from 'jquery';
import * as XLSX from 'xlsx';
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {ElectronService} from './electron.service';

// export


declare type ExportType = 'excel' | 'pdf';

interface Intervals {
  exportType: ExportType;
  begin: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private dialog: MatDialog, public config: SettingsService) { }
  /**
   * @method
   * @name openDialog
   * */
  openDialog(begin: string, end: string, exportType = 'excel') {
    const dialogRef = this.dialog.open(ExportMenuReportsComponent, {
      width: '450px',
      data: {begin, end, exportType},
      disableClose: true
    });
  }
}

interface MenuCategoryReportBody {
  date: string;
  data: number[];
}

/***
 * Export modal
 * **/
@Component({
  styles: [`.img {
      width: 75px;
      height: 75px;
      display: flex;
      justify-content: center;
      align-items: center;
  }`],
  template: `
      <section>
          <h3 mat-dialog-title class="text-center">Export data</h3>
          <div mat-dialog-content class="pt-3 pb-6 px-6">
              <div class="row">
                  <div class="col-sm-3">
                      <div class="img rounded-full border border-theme-default">
                          <img *ngIf="data.exportType === 'excel'" src="assets/images/excel.png" alt="pc">
                          <img *ngIf="data.exportType === 'pdf'" src="assets/images/pdf.png" alt="pc">
                      </div>
                  </div>
                  <div class="col-sm-9">
                      <h4 class="w-full overflow-hidden whitespace-no-wrap" style="text-overflow: ellipsis;">
                          {{config.getAllConfig().company_name}} Menu item reports</h4>
                      <p class="mb-3"><small>{{(exportMetaData.startDate | date: 'dd/MM/yyyy') + ' - ' + (exportMetaData.endDate | date: 'dd/MM/yyyy')}}</small></p>
                      <p *ngIf="showLoader && !jobsDone">
                          <small>Generating report..</small>
                          <mat-progress-bar [value]="progressBar"></mat-progress-bar>
                      </p>
                      <p *ngIf="!showLoader && !jobsDone">
                          <small>Generating {{this.data.exportType}} document...</small>
                          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                      </p>
                      <p class="text-green " *ngIf="jobsDone && !exportMetaData.errorText">
                          <span class="mr-2"><fa-icon [icon]="checkIcon"></fa-icon></span>
                          <small>{{this.data.exportType | titlecase}} generated</small>
                      </p>
                      <p class="text-red" *ngIf="jobsDone && exportMetaData.errorText">
                          <span class="mr-2"><fa-icon [icon]="errorIcon"></fa-icon></span>
                          <span>Failed to generate {{this.data.exportType}}, File might be in use by another program.</span>
                      </p>
                      <div id="exportDataContainer" style="display: none;">
                          <section class="page" style="height: 100%;position:relative;">
                              <table #table id="dataTable">
                                  <thead>
                                  <tr>
                                      <th>Date</th>
                                      <th *ngFor="let c of categories">{{c}}</th>
                                    <th>Total</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr *ngFor="let sale of categorySaleByDates">
                                      <td style="font-weight: 700;">{{sale.date}}</td>
                                      <td *ngFor="let f of sale.data">{{f}}</td>
                                  </tr>
                                  </tbody>
                              </table>
                          </section>
                      </div>
                  </div>
              </div>
          </div>
          <div mat-dialog-actions style="justify-content: space-between;">
              <div class=""><mat-checkbox [(ngModel)]="openFileAtCompletion">open file when complete</mat-checkbox></div>
              <div class="">
                  <span class="mr-2"><button [disabled]="!showLoader && !jobsDone" (click)="onClose()" mat-stroked-button>cancel</button></span>
              </div>
          </div>
      </section>
  `
})
export class ExportMenuReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  reports: ReportsModel[];
  progressBar = 0; // progress bar value
  showLoader = true; // if true -> shows progress bar, else shows indeterminate progress bar
  jobsDone = false; // if true -> means export has been completed
  categories: string[] = [];
  menuItems: string[] = [];
  checkIcon = faCheckCircle;
  errorIcon = faTimesCircle;
  categorySaleByDates: MenuCategoryReportBody[] = []; // export data containing category data
  exportMetaData = {startDate: null, endDate: null, errorText: null}; // displays in export in modal and pdf and excel
  @ViewChild('table', {static: false}) table: ElementRef;
  openFileAtCompletion = true; // open the file after export

  constructor(public config: SettingsService, public dialogRef: MatDialogRef<ExportMenuReportsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Intervals, private db: DbService,
              private electronService: ElectronService, private snackBar: MatSnackBar, private ref: ChangeDetectorRef) {
    dialogRef.disableClose = true;
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getReports()
      .then(reports => {
        // get export dates
        this.exportMetaData.startDate = reports[0].createdAt;
        this.exportMetaData.endDate = reports[reports.length - 1].createdAt;
        // get menu Items name and categories
        reports.forEach(rp => {
          rp.menuCategoryConnection.forEach(cat => {
            if (this.categories.indexOf(cat.menuCategory.name) === -1) {
              this.categories.push(cat.menuCategory.name);
            }
          });
          rp.menuItemConnection.forEach(mCon => {
            if (this.menuItems.indexOf(mCon.menuItem.name) === -1) {
              this.menuItems.push(mCon.menuItem.name);
            }
          });
        });
        this.ref.detectChanges();
        // get reports
        this.reports = reports;
        // generate categories report
        this.generateMenuCategoriesReport();
      });
    // // get menu categories
    // this.db.getAllMenuCategories()
    //   .subscribe((categories) => {
    //     this.categories = categories.map(cat => cat.name);
    //     this.ref.detectChanges();
    //   });
    // // get menu items
    // this.db.getAllMenuItems()
    //   .subscribe((mItems) => {
    //     this.menuItems = mItems.map(item => item.name);
    //     this.ref.detectChanges();
    //   });
  }

  /**
   * on close dialog
   * */
  onClose(): void {
    this.dialogRef.close();
  }
  /***
   * Generate report
   * */
  getReports(): Promise<ReportsEntity[]> {
    if (!this.data.begin || !this.data.end) {
      return this.db.getReports();
    } else {
      return this.db.getReportsByDate(this.data.begin, this.data.end);
    }
  }
  // generate menu categories report
  generateMenuCategoriesReport() {
    const _overall_total = {date: 'TOTAL', data: Array.apply(null, Array(this.categories.length + 1)).map(() => 0)};
    this.reports.forEach((rp, index) => {
      if (rp.dateId !== 'GLOBAL') {
        // get progress
        this.progressBar = ((index + 1) / this.reports.length) * 100;
        // category amount by date object
        const _n = {date: new DatePipe('en-GB').transform(rp.createdAt, 'dd/MM/yy'), data: Array.apply(null, Array(this.categories.length + 1)).map(() => 0)};
        rp.menuCategoryConnection.forEach(catCon => {
          // adding to daily total
          _n.data[_n.data.length - 1] += catCon.amount;
          // summing overall totals
          _overall_total.data[_overall_total.data.length - 1] += catCon.amount;
          // console.log(this.categories);
          const category_index = this.categories.findIndex(cat => cat === catCon.menuCategory.name);
          // console.log(category_index);
          if (category_index > -1) {
            _n.data[category_index] = catCon.amount;
            // incrementing overall total
            _overall_total.data[category_index] += catCon.amount;
          }
        });
        this.categorySaleByDates.push(_n);
      }
    });
    this.categorySaleByDates.push(_overall_total);
    // console.log(this.categorySaleByDates);
    // save file
    this.exportToFile(this.data.exportType);
  }

  exportToFile(type: ExportType) {
    const defaultTitle = this.config.getAllConfig().company_name.toUpperCase() + '_MENU_REPORTS_' +
      new DatePipe('en-GB').transform(this.exportMetaData.startDate, 'dd_MM_yyyy') + '_' +
      new DatePipe('en-GB').transform(this.exportMetaData.endDate, 'dd_MM_yyyy');
    switch (type) {
      case 'excel':
        this.electronService.remote.dialog.showSaveDialog({
          title: 'Save as',
          defaultPath: defaultTitle,
          filters: [{
            name: 'Excel', extensions: ['xls']}]
        }, async (path) => {
          if (path) {
           try {
             // hide progress bar
             this.showLoader = false;
             // convert to excel
             const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
             const wb: XLSX.WorkBook = XLSX.utils.book_new();
             XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
             /* save to file */
             XLSX.writeFile(wb, path);
             // hide progress bars and show completed status
             this.jobsDone = true;
             // close dialog if open
             this.dialogRef.close();
             // open file if open file at completion is set...
             if (this.openFileAtCompletion) {
               this.openFile(path);
             }
             // this.snackBar.open('Excel file generated', 'close', {duration: 3500});
             // detect changes
             this.ref.detectChanges();
           } catch (e) {
             // close dialog if open
             this.dialogRef.close();
             // this.snackBar.open('Failed to generate Excel file', 'close', {duration: 3800});
             console.error(e);
             if (e.toString().indexOf('EBUSY')) {
               this.snackBar.open('The file is in use by another program', '', {duration: 3500});
             } else {
               this.snackBar.open('Failed to export file.', '', {duration: 3500});
             }
             // detect changes
             this.ref.detectChanges();
           }
          }
        });
        break;
        case 'pdf':
          this.electronService.remote.dialog.showSaveDialog({
            title: 'Save as',
            defaultPath: defaultTitle,
            filters: [{
              name: 'PDF', extensions: ['pdf']}]
          }, async (path) => {
            if (path) {
              // convert to pdf
              // get html data from table
              const html = `
              <html>
              <head>
              <style>
              *{padding: 0;margin: 0; box-sizing: border-box;}
              table {margin: 15px 10px;font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: calc(100% - 20px);}
               table td, table th {border: 1px solid #ddd;padding: 8px;}
               table tr:nth-child(even){background-color: #f2f2f2;}
               table tr:hover {background-color: #ddd;}
               table th {padding-top: 12px;padding-bottom: 12px;text-align: left;
               background-color: #00695C;color: white;}
               #pageFooter {position:fixed;bottom: 0; left: 0; font-size: 80%;z-index: 1;right: 0; text-align: right;
               border-top: 1px solid #dddddd; padding: 10px 15px;}
              </style>
              </head>
              <body>
              <div id="pageHeader" class="header"
                  style="padding: 24px 12px 32px;background: #f5f5f5;border-bottom: 1px solid #000;text-align: center;text-transform: capitalize;">
                 <h1>${this.config.getAllConfig().company_name.toUpperCase()} MENU ITEM REPORTS</h1>
                 <h3>Menu item category sales(${this.config.getAllConfig().company_currency}) by date</h3>
                 <h4>${this.exportMetaData.startDate + ' - ' + this.exportMetaData.endDate}</h4>
              </div>
                 ${$('#exportDataContainer').html()}
                 <div id="pageFooter" class="footer">
                     <span style="float: right">Generated by ${this.config.AppConfig.name}</span>
                 </div>
              </body>
              </html>
              `;
              // generate pdf file...
              this.electronService.ipcRenderer.send('generate-pdf', {html, path});
              this.showLoader = false;
              this.ref.detectChanges();
              this.electronService.ipcRenderer.on('generate-pdf-complete', (ev, res) => {
                this.dialogRef.close(true);
                this.jobsDone = true;
                this.exportMetaData.errorText = res.error ? res.errorText : null;
                // open file if open file at completion is set...
                if (this.openFileAtCompletion) {
                  this.openFile(path);
                }
                // detect changes
                this.ref.detectChanges();
              });
            }
          });
          break;
    }
  }

  // open file by windows default way
  openFile(path: string) {
    this.electronService.shell.openItem(path);
  }

  // when the component is destroyed
  ngOnDestroy(): void {
    // console.log('destroyed');
  }

}
