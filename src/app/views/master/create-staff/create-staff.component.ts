import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {faChevronDown, faChevronLeft, faPencilAlt} from '@fortawesome/free-solid-svg-icons';

import {MatSnackBar} from '@angular/material';

import * as $ from 'jquery';
import {DbService} from '../../../providers/db.service';
import {StaffGroupModel, UserPermissions} from '../../../data-access/entities';
import {SettingsService} from '../../../providers/settings.service';
import {StaffGroupComponent} from '../staff-group/staff-group.component';
import {Directories} from '../../../../../api/modules/directories-module';
import {ElectronService} from '../../../providers/electron.service';

@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.scss']
})
export class CreateStaffComponent implements OnInit, AfterViewInit {
  // inserting staff group component as view child
  @ViewChild(StaffGroupComponent, {static: false}) staffGroupComp: StaffGroupComponent;
  /**
   * @property createForm: creating and instance of angular's reactive api form group so as to collectively get states of input
   * Learn more about-config reactive forms: https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   * Generating and grouping data with form builder,
   * Learn more about-config angular Reactive-Form builders: https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   * */
  createForm = this.formBuilder.group({
    firstName: [null, Validators.required],
    lastName: [null],
    group: [null],
    phoneNumber: [null],
    selectedGroup: [''],
    email: [null, Validators.email],
    age: [null],
    gender: [null],
    userName: [null],
    isManager: [false],
    password: [null],
    confirmPassword: [null],
    workShift: [null],
    salary: [null],
    contractType: [null],
    imageUrl: [null],
    image: [null],
    resume: [null],
    resumeUrl: [{value: '', disabled: true}],
    permissions: this.formBuilder.group(new UserPermissions(false))
  });
  // branchControlIndex = new FormControl(0);
  /**
   * @property backIcon
   * @property fileImport
   * @property cheveronDown
   * @property createIcon
   * @property staffManager
   * @property branchManager
   * @property staffGroups
   * @property branches
   * @property formModel: StaffAlt object binned to form in view
   * @property importedFiles: object containing info (basename, path, size) of all the files imported by user
   * */
  backIcon = faChevronLeft;
  // fileImport = faFileImport;
  cheveronDown = faChevronDown;
  createIcon = faPencilAlt;
  staffGroups: StaffGroupModel[];
  uploadImagePath: string;
  // branches: BranchModel[];


  constructor(
    private db: DbService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private config: SettingsService,
    private electron: ElectronService
  ) { }
  /**
   * @methods getter methods for formControl elements requiring validation, to be used for validation in DOM
   * */
  get firstName() {
    return this.createForm.get('firstName');
  }
  get lastName() {
    return this.createForm.get('lastName');
  }
  get email() {
    return this.createForm.get('email');
  }
  get branch() {
    return this.createForm.get('branch');
  }
  get gender() {
    return this.createForm.get('gender');
  }
  get username() {
    return this.createForm.get('userName');
  }
  get imageUrl() {
    return this.createForm.get('imageUrl');
  }
  get permissions() {
    return this.createForm.get('permissions');
  }
  get currency() {
    return this.config.get('company_currency');
  }
  get company_name() {
    return this.config.get('company_name');
  }
  /**
   * @method
   * @name ngOnInit
   * */
  ngOnInit() {
    // after initializing database manager , fetching data...
    this.staffGroups = [];
    // this.branches = [];
  }

  ngAfterViewInit(): void {
    // get all user groups
    this.db.getAllStaffGroups()
      .then((data) => {
        this.staffGroups = data;
      });
  }
  /**
   * @method
   * @name back
   * @summary return back to the view which called this component.
   * */
  back() {
    window.history.back();
  }
  /**
   * @method
   * @name renderUserImage
   * @summary processes image imported by user (checks if the images complies with the size limit), adds image to importedFiles object,creates object URL
   * */
  renderUserImage(file) {
    // if image size is greater than 5Mb
    if (file.size > 3000000) {
      this.snackBar.open('Consider importing a picture below 3MB', 'close', {
        duration: 3500
      });
      return false;
    }
    // get extension of image
    let ext_name = file.path.split('.');
    ext_name = ext_name[ext_name.length - 1];
    // file name
    const new_file = `${Directories.USERS_RES_DIR}/${this.firstName.value[0]}${Math.round(9999999999 * Math.random() + 1000000000).toString()}.${ext_name}`;
    // patch form
    this.uploadImagePath = file.path;
    this.createForm.patchValue({imageUrl: new_file});
    // create object url and pass it profile-config image placeholder
    // @ts-ignore
    document.querySelector('#userImagePlaceholder').src = URL.createObjectURL(file);
    // convert blob to base64 string..
    /*const reader = new FileReader();
    reader.onload = (e) => {
      this.createForm.patchValue({imageUrl: {string: b64, type: file.type}});
      const b64 = reader.result.toString().replace(/^data:.+;base64,/, '');
      // @ts-ignore
      // document.querySelector('#userImagePlaceholder').src = URL.createObjectURL(NudleService.Base64ToBlob(b64, file.type));
    };
    reader.readAsDataURL(file);*/
  }
  /**
   * @method
   * @name userImageChanged
   * @summary This method is fired when the input[type=file] is fired
    **/
  userImageChanged(e) {
    const file = e.target.files[0];
    this.renderUserImage(file);
  }
  /**
   * @method
   * @name slideToggle
   * */
  slideToggle(el) {
    $(el).slideToggle('fast');
  }
  /**
   * @method
   * @name checkPasswordsMatch
   * @summary check if passwords match
   * */
  checkPasswordsMatch(e) {
    console.log(e.target.value);
    if (this.createForm.get('password').value && this.createForm.get('password').value !== e.target.value) {
      this.snackBar.open('Passwords do not match', 'close', {
        duration: 3000
      });
      return;
    }
  }
  /**
   * @method
   * @name saveEmployee
   * @summary add user to database
   * */
  saveEmployee(e) {
    // some basic validation
    if (this.createForm.get('firstName').invalid) {
      this.snackBar.open('Please enter first name', 'close', {
        duration: 3000
      });
      return;
    }
    if (this.username.value && (this.createForm.get('password').value !== this.createForm.get('confirmPassword').value)) {
      this.snackBar.open('Passwords do not match', 'close', {
        duration: 3000
      });
      return;
    }
    /*if (!this.createForm.get('branch').value) {
      this.snackBar.open('Please select a branch', 'close', {
        duration: 3000
      });
      return;
      }
      */
    if (!this.username.value && !this.createForm.get('group').value) {
      this.snackBar.open('Please select user\'s role', 'close', {
        duration: 3000
      });
      return;
    }
    // adding files to database
    this.db.addStaff(this.createForm.value)
      .then((data) => {
        // console.log(data);
        // save user's image if imported...
        try {
          // saving file
          if (this.uploadImagePath && this.createForm.get('imageUrl').value) {
            this.electron.fs.createReadStream(this.uploadImagePath)
                .pipe(this.electron.fs.createWriteStream(this.createForm.get('imageUrl').value));
            console.clear();
            console.log(this.uploadImagePath, this.createForm.get('imageUrl').value);
          }
        } catch (e) {
          // TODO: logger
          console.error(e);
          this.snackBar.open('Failed to save user image', 'close',
              {duration: 3500, horizontalPosition: 'end'});
        }
        // reset form
        this.createForm.reset();
        $('#userImagePlaceholder').attr('src', 'assets/images/uploadUserImg.png');
        this.snackBar.open('Profile created!', 'close', {duration: 2500});
      }).catch(err => {
        // TODO: logger
        console.error(err);
      if (err.message.indexOf('email') > -1) {
        this.snackBar.open('Email in use by another user', 'close', {duration: 2500});
      } else {
        this.snackBar.open('Error: creating user', 'close', {duration: 2500});
      }
    })
    ;
  }
  /**
   * @method
   * @name onUserGroupChange
   * @summary when staff group select changes, this method is fired to assign group's permissions to newly created user.
   * */
  onUserGroupChange(e) {
    if (!isNaN(Number(e.value))) {
      if (this.permissions.value) {
        this.createForm.patchValue({group: this.staffGroups[e.value]});
        this.createForm.patchValue({permissions: this.staffGroups[e.value].permissions});
      }
      // if selected group is admin, make currency user manager
      if (this.staffGroups[e.value].isRoot) {
        this.createForm.patchValue({isManager: true});
      } else {
        this.createForm.patchValue({isManager: false});
      }
    } else if (e.value === 'createUserRole') {
      this.toggleTopModal('#createStaffGroup');
    }
  }
  /**
   * @method
   * @name toggleTopModal
   * @summary open permissions modal
   * */
  toggleTopModal(id) {
    $(id).fadeToggle('fast');
  }
  /***
   * save new user group to database and add to array
   * */
  createStaffGroup() {
    this.staffGroupComp.formAction()
      .then((data) => {
        console.log(data);
        this.staffGroups.push(data);
        this.createForm.patchValue({group: data, selectedGroup: this.staffGroups.length - 1});
        // set current user's permissions to group's permissions
        if (this.permissions.value) {
          this.createForm.patchValue({permissions: data.permissions});
        }
        this.toggleTopModal('#createStaffGroup');
      })
      .catch((err) => {
        console.error(err);
        this.snackBar.open('Failed to create user role, Make sure you inserted valid values.', 'close', {duration: 2500});
      });
  }
}
