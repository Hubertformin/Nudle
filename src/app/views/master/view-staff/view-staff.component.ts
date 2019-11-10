import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {faChevronDown, faPen, faPlusCircle, faSearch,  faUserLock} from '@fortawesome/free-solid-svg-icons';
import {PromptPasswordService} from '../../../providers/prompt-password.service';
import { NudleService } from '../../../providers/nudle.service';
import {faTrashAlt, faUser} from '@fortawesome/free-regular-svg-icons';
import {FormBuilder} from '@angular/forms';
import {DbService} from '../../../providers/db.service';
import * as $ from 'jquery';
import {StaffEntity, StaffGroupEntity} from '../../../data-access/entities';
import {AuthService} from '../../../providers/auth.service';
import {MatSnackBar} from '@angular/material';
import {StaffGroupComponent} from '../staff-group/staff-group.component';

@Component({
  selector: 'app-users',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(StaffGroupComponent, {static: false})
  private staffGroupComp: StaffGroupComponent;
  /**
   * @property staffManger: StaffAlt manager object, to create , update and delete staff.
   * @property staff: staff array containing all staff objects fetched from database.
   * @property selectedRows: this array contains all objects selected (checkbox selected) from the table, to get the object data: this.selectedRows[index].data
   * @property addUserIcon:
   * @property editUserIcon:
   * @property removeUserIcon:
   * @property columnDefs: Table columns definition object.
   * */
  // set the action mode of the form, by default would be set to true, meaning the action of the form is to create a new staff group,
  // set to false, is you want the action mode of the form to update instead...
  FORM_ACTION_CREATE: boolean;
  staff: StaffEntity[] = [];
  staffGroups: StaffGroupEntity[]  = [];
  selectedRows = [];
  staffIcon = faUser;
  plusIcon = faPlusCircle;
  dropDownIcon = faChevronDown;
  editStaff = faPen;
  deleteStaffIcon = faTrashAlt;
  activeTab: string;
  lockIcon = faUserLock;
  searchIcon = faSearch;
  staffSearchResults: StaffEntity[] = [];

  constructor(
    private db: DbService,
    private promptPassword: PromptPasswordService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private nudleService: NudleService
  ) {}
  /**
   * @method
   * @name ngOnInit
   * @summary angular life cycle on attach method..
   */
  ngOnInit() {
    this.activeTab = 'staff';  // setting initial tab.
    // initialize create state of group(roles) form
    this.FORM_ACTION_CREATE = true;
  }
  ngAfterViewInit(): void {
    this.db.getAllStaff()
      .then((rows) => {
        this.staff = rows;
        console.log(rows);
        // get all user profile-config pictures
        // this.getUsersProfilePictures();
      });
    // get staff groups
    this.db.getAllStaffGroups()
      .then((data) => {
        this.staffGroups = data;
        // set random styles
        $('.random-bg').css('background', this.nudleService.randomColor);
      });
  }
  /**
   * Getters
   * */
  get authUser() {
    return this.authService.getAuthUser();
  }
  /**
   * @method
   * @name onSelectionChanged
   * @param event
   * @summary This method is fired when table rows get selected (checkbox clicked)
   */
  onSelectionChanged(event) {
    this.selectedRows = event.api.getSelectedNodes();
  }
  /**
   * @method
   * @name deleteStaff
   * @summary handle deleting of staff.
   */
  deleteStaff(index: number) {
    // const person = this.selectedRows.length === 1 ? this.selectedRows[0].data.firstName : `these ${this.selectedRows.length} staff members`;
    this.promptPassword.openDialog(`Are you sure to remove ${this.staff[index].firstName}`)
      .subscribe((isConfirm) => {
        if (isConfirm) {
          this.db.deleteStaff(this.staff[index].id)
            .then((data) => {
              this.staff.splice(index, 1);
            }, (err) => {
              console.error(err);
              this.snackBar.open('Unknown error(FATDE8): unable to delete profile-config.');
            });
        } else {
          this.snackBar.open('Wrong password', 'close', {duration: 3000});
        }
      });
  }
  // get users profile-config pictures
  /*getUsersProfilePictures() {
    this.staff.forEach((el, index) => {
      if (el.img_url) {
        // since this process runs asynchronously
        const image = fs.createReadStream(`${NudleService.emp_path}/${el.img_url}`);
        image.pipe(concat({ encoding: 'buffer' }, function (buf) {
          let ext = path.extname(`${NudleService.emp_path}${el.img_url}`).slice(1);  // assuming you have the file title
          if (ext === 'svg') { ext = 'svg+xml'; }
          // @ts-ignore
          document.querySelector('#user_img_' + el.id).src = 'data:image/' + ext + ';base64,' + buf.toString('base64');
        }));
        image.on('error', e => {
          // common error would be if file is unavailable is location..
          console.error(e);
        });
      }
    });
  }*/
  /**
   * ============================== STAFF GROUP METHODS ===========================
   * */
  toggleCreateGroupMode() {
    this.staffGroupComp.toggleCreateMode();
    this.toggleStaffGroupModal();
  }
  toggleUpdateGroupMode(id: number, index: number) {
    this.staffGroupComp.toggleEditMode(id, index);
    this.toggleStaffGroupModal();
  }
  // form action: when form is submitted, triggers update or delete depending on current form state.
  groupFormAction() {
    this.staffGroupComp.formAction()
      .then((data) => {
        if (this.staffGroupComp.FORM_ACTION_CREATE) {
          this.staffGroups.push(data);
        } else if (!this.staffGroupComp.FORM_ACTION_CREATE && this.staffGroupComp.PARENT_VIEW_INDEX) {
          this.staffGroups[this.staffGroupComp.PARENT_VIEW_INDEX] = data;
        }
        this.toggleStaffGroupModal();
      });
  }
  // create staff group (roles)
  toggleStaffGroupModal() {
    $('#createStaffGroup').fadeToggle('fast');
  }
  deleteStaffGroup(index: number) {
    if (window.confirm('Are you sure?')) {
      this.promptPassword.openDialog('Delete' + this.staffGroups[index].name + '?')
        .subscribe((isConfirm) => {
          if (isConfirm) {
            this.db.deleteStaffGroup(this.staffGroups[index].id)
              .then((data) => {
                console.log(data);
                this.staffGroups.splice(index, 1);
              }, (err) => {
                console.error(err);
                this.snackBar.open('Unknown error(FATDE8): unable to delete role.');
              });
          } else {
            this.snackBar.open('Wrong password', 'close', {duration: 3000});
          }
        });
    }
  }


  // ========================= ON DESTROY ====================
  ngOnDestroy(): void {
    this.staffGroups = null;
    this.staff = null;
  }

    searchStaff() {
        const view = $('#searchStaffRes');
        const val = $('#searchStaffInput').val().toLowerCase();
        if (val === '') {
            view.fadeOut('fast');
            return;
        }
        this.staffSearchResults = this.staff.filter((user, index) => {
            if (index > 10) {
                return false;
            }
            if (user.firstName.toLowerCase().indexOf(val) > -1) {
                return true;
            }
            if (user.lastName) {
                if (user.lastName.toLowerCase().indexOf(val) > -1) { return true; }
            }
            if (user.email) {
                console.log(val);
                if (user.email.toLowerCase().indexOf(val) > -1) { return true; }
            }
            if (user.gender) {
                if (user.gender.toLowerCase().indexOf(val) > -1) { return true; }
            }
            if (user.userName) {
                if (user.userName.toLowerCase().indexOf(val) > -1) { return true; }
            }
            if (user.group) {
                if (user.group.name.toLowerCase().indexOf(val) > -1) { return true; }
            }
            if (user.age) {
                if (user.age.toString().indexOf(val) > -1) { return true; }
            }
            if (user.phoneNumber) {
                if (user.phoneNumber.toLowerCase().indexOf(val) > -1) { return true; }
            }
            return false;
        });
        // show viw
        view.fadeIn('fast');
    }
}
