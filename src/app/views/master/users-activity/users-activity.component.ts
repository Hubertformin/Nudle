import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DbService} from '../../../providers/db.service';
import { StaffEntity} from '../../../data-access/entities';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import {faCheckCircle, faSearch, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import {SettingsService} from '../../../providers/settings.service';

@Component({
  selector: 'app-users-activity',
  templateUrl: './users-activity.component.html',
  styleUrls: ['./users-activity.component.scss']
})
export class UsersActivityComponent implements OnInit, AfterViewInit {
  searchIcon = faSearch;
  checkIcon = faCheckCircle;
  crossIcon = faTimesCircle;
  staff: StaffEntity[];
  selectedStaff: StaffEntity |any;
  selectedWorkshiftStaff: StaffEntity[];
  selectedDayIndex: string;

  constructor(public config: SettingsService, private db: DbService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // init
    this.selectedWorkshiftStaff = [];
  }
  ngAfterViewInit(): void {
    // get all staff members
    this.db.getAllStaff()
      .then((rows) => {
        this.staff = rows;
        // console.log(rows);
        // get all user profile-config pictures
        // this.getUsersProfilePictures();
        // get worshift
        this.getWorkShifts('1');
      });
  }

  // SELECT STAFF
  selectStaff(id: number) {
    this.db.getStaffActivity(id)
      .then((staff) => {
        this.selectedStaff = staff;
      }).catch((err) => {
        console.error(err);
      this.snackBar.open('Failed to get user\'s activity', 'close', {duration: 3500});
    });
  }
  // get work-shift day from array of selected user
  isWorkShiftDay(index: string) {
    if (!this.selectedStaff.workShift) {
      return false;
    }
   return this.selectedStaff.workShift.indexOf(index) > -1;
  }

  searchList($event) {
    const value = $event.target.value.toLowerCase();
    $('.list-item').each((index, el) => {
      const username_text = $(el).find('.user-name').text().toLowerCase();
      const userGroup_text = $(el).find('.user-group').text().toLowerCase();
      if (username_text.toLowerCase().indexOf(value) > -1 || userGroup_text.toLowerCase().indexOf(value) > -1) {
        $(el).fadeIn('fast');
      } else {
        $(el).fadeOut('fast');
      }
    });
  }

  getTotalAmount(receivedSales) {
    let total = 0;
    receivedSales.forEach(el => {
      total += Number(el.totalAmount);
    });
    return total;
  }

  getWorkShifts(index: string) {
    this.selectedWorkshiftStaff = this.staff.filter(s => s.workShift ? s.workShift.indexOf(index) > -1 : false);
    this.selectedDayIndex = index;
  }
}
