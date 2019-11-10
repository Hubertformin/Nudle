import { Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {faChevronDown, faChevronLeft, faPencilAlt, faTrash} from '@fortawesome/free-solid-svg-icons';
import {MatSnackBar} from '@angular/material';

import * as $ from 'jquery';
import {StaffGroupEntity, StaffGroupModel, UserPermissions} from '../../../data-access/entities';
import {StaffGroupComponent} from '../staff-group/staff-group.component';
import {DbService} from '../../../providers/db.service';
import {Directories} from '../../../../../api/modules/directories-module';
import {ElectronService} from '../../../providers/electron.service';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss']
})
export class EditStaffComponent implements OnInit {
  @ViewChild(StaffGroupComponent, {static: false}) staffGroupComp: StaffGroupComponent;
  /**
   * @property editForm: creating and instance of angular's reactive api form group so as to collectively get states of input
   * Learn more about-config reactive forms: https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   * Generating and grouping data with form builder,
   * Learn more about-config angular Reactive-Form builders: https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   * */
  editForm = this.formBuilder.group({
    id: [null],
    firstName: [null, Validators.required],
    lastName: [null],
    group: [null],
    phoneNumber: [''],
    email: ['', Validators.email],
    age: [null],
    gender: ['', Validators.required],
    userName: [''],
    isManager: [false],
    isActive: [true],
    password: [''], // user's current password
    // old_password: [null], // control to validate user's old password on password change
    new_password: [null], // user's new password control
    confirm_password: [null], // confirm password control
    workShift: [''],
    salary: [''],
    contractType: [''],
    imageUrl: [null],
    selectedGroup: [null], // selected group id, to show specific staff group select
    permissions: this.formBuilder.group(new UserPermissions(false))
  });
  /**
   * @property backIcon
   * @property fileImport
   * @property cheveronDown
   * @property createIcon
   * @property deleteIcon
   * @property staffManager
   * @property branchManager
   * @property staffGroups
   * @property branches
   * @property changePasswordModel: object which validates changing of passwords by comparing if old password corresponds to active password...
   * @property showPasswordInput: by default hide passwords inputs by default
   * @property importedFiles: object containing info (basename, path, size) of all the files imported by user
   * */
  backIcon = faChevronLeft;
  cheveronDown = faChevronDown;
  createIcon = faPencilAlt;
  deleteIcon = faTrash;
  staffGroups: StaffGroupEntity[] = [];
  showPasswordInput: boolean;
  private uploadImagePath: string;


  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private db: DbService,
              private electron: ElectronService
  ) { }
  /**
   * @methods getter methods for formControl elements requiring validation, to be used for validation in DOM
   * */
  get firstName() {
    return this.editForm.get('firstName');
  }
  get lastName() {
    return this.editForm.get('lastName');
  }
  get email() {
    return this.editForm.get('email');
  }
  get imageUrl() {
    return this.editForm.get('imageUrl');
  }
  get permissions() {
    return this.editForm.get('permissions');
  }
  get password_control() {
    return this.editForm.get('password');
  }
  /**
   * @method
   * @name ngOnInit
   * */
  ngOnInit() {
    this.showPasswordInput = false;
    // set up drag and drop for user image container
    const el = document.querySelector('#userImageContainer');
    el.addEventListener('dragover', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
    });
    // el.addEventListener('drop', (e) => {
    //   // @ts-ignore
    //   const file = e.dataTransfer.files[0], extname = ['.jpg', '.png', '.svg', '.jpeg', '.gif', '.jfif', '.ico', '.bmp', '.tiff'];
    //   if (extname.indexOf(this.electronService.path.extname(file.path).toLowerCase()) === -1) {
    //     this.snackBar.open('Please import an image', 'close', {
    //       duration: 3500
    //     });
    //     return false;
    //   }
    //   this.renderUserImage(file);
    // });
    // get all role
    this.db.getAllStaffGroups()
        .then(data => {
          this.staffGroups = data;
        });
    // get staff by id
    this.activatedRoute.paramMap
        .subscribe( (map) => {
          // @ts-ignore
          this.db.getStaff(Number(map.params.id))
              .then(data => {
                // replace with group id or group object
                this.editForm.patchValue({
                  id: data.id,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  age: data.age,
                  group: data.group,
                  gender: data.gender,
                  email: data.email,
                  password: data.password,
                  phoneNumber: data.phoneNumber,
                  userName: data.userName,
                  isManager: data.isManager,
                  isActive: data.isActive,
                  workShift: data.workShift,
                  contractType: data.contractType,
                  salary: data.salary,
                  imageUrl: data.imageUrl,
                  selectedGroup: data.group ? data.group.id : '',
                  permissions: data.permissions ? data.permissions : new UserPermissions(false)
                });
              });
        });
  }

  // getters
  get user_role() {
    return this.editForm.get('group');
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
    if (file.size > 5000000) {
      this.snackBar.open('Consider importing a picture below 5MB', 'close', {
        duration: 3500
      });
      return false;
    }
    // get extension of image
    let ext_name = file.path.split('.');
    ext_name = ext_name[ext_name.length - 1];
    const new_file = `${Directories.USERS_RES_DIR}/${this.firstName.value[0]}${Math.round(9999999999 * Math.random() + 1000000000).toString()}.${ext_name}`;
    // patch form
    this.uploadImagePath = file.path;
    this.editForm.patchValue({imageUrl: new_file});
    // create object url and pass it profile-config image placeholder
    // @ts-ignore
    document.querySelector('#userImagePlaceholder').src = URL.createObjectURL(file);
    // parse image
    /*const reader = new FileReader();
    reader.onload = ev => {
      const b64 = reader.result.toString().replace(/^data:.+;base64,/, '');
      this.editForm.patchValue({imageUrl: {string: b64, type: file.type}});
      // update database
      this.db.updateStaff(this.editForm.value)
        .catch(err => console.error(err));
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
  slideToggle(el) {
    $(el).slideToggle('fast');
  }
  /**
   * @method
   * @name updateStaff
   * @summary add user to database
   * */
  updateStaff(e) {
    if (this.editForm.get('firstName').invalid) {
      this.snackBar.open('Please insert a first name', 'close', {duration: 3000});
      return;
    }
    // some basic validation
    if (this.editForm.get('new_password').value && this.editForm.get('new_password').value !== this.editForm.get('confirm_password').value) {
      this.snackBar.open('Passwords do not match', 'close', {
        duration: 3000
      });
      return;
    }
    // set password
    if (this.editForm.get('new_password').value && this.editForm.get('new_password').value === this.editForm.get('confirm_password').value) {
      this.editForm.patchValue({password: this.editForm.get('new_password').value});
    }
    // adding files to database
    this.db.updateStaff(this.editForm.value)
      .then((data) => {
        this.snackBar.open('Profile updated', 'close', {duration: 3000});
        // upload image is imported
        if (this.uploadImagePath) {
          try {
            // saving file
            this.electron.fs.createReadStream(this.uploadImagePath)
                .pipe(this.electron.fs.createWriteStream(this.editForm.get('imageUrl').value));
          } catch (e) {
            // TODO: logger
            console.error(e);
            this.snackBar.open('Failed to save user image', 'close',
                {duration: 3500, horizontalPosition: 'end'});
          }
        }
      })
      .catch(err => {
        console.error(err);
        if (err.message.indexOf('email') > -1) {
          this.snackBar.open('Email in use by another user', 'done', {duration: 3000});
        } else {
          this.snackBar.open('Error: Unable to update profile', 'close', {duration: 3000});
        }
      });
  }
  /**
   * @method
   * @name onUserGroupChange
   * @summary when staff group select changes, this method is fired to assign group's permissions to newly created user.
   * */
  onUserGroupChange(e) {
    if (!isNaN(Number(e.value))) {
      const selectedGroup: StaffGroupModel = this.staffGroups.filter(el => el.id === e.value)[0];
      this.editForm.patchValue({group: selectedGroup});
      // set currency user as manager if selected group was admin
      if (selectedGroup.isRoot) {
        this.editForm.patchValue({isManager: true});
      } else {
        this.editForm.patchValue({isManager: false});
      }
      if (this.permissions.value) {
        this.editForm.patchValue({permissions: selectedGroup.permissions});
      }
    } else if (e.value === 'createUserRole') {
      this.toggleTopModal('#createStaffGroup');
    }
  }
  /**
   * @method
   * @name openTopModal
   * @summary open permissions modal
   * */
  openTopModal() {
    $('#setPermissionModal').slideDown('fast');
  }
  /**
   * @method
   * @name closeTopModal
   * @summary close permissions modal
   * */
  closeTopModal() {
    $('#setPermissionModal').slideUp('fast');
  }
  /***
   * save new user group to database and add to array
   * */
  createStaffGroup() {
    this.staffGroupComp.formAction()
      .then((data) => {
        console.log(data);
        this.staffGroups.push(data);
        this.editForm.patchValue({group: data, selectedGroup: data.id});
        // set current user's permissions to group's permissions
        if (this.permissions.value) {
          this.editForm.patchValue({permissions: data.permissions});
        }
        this.toggleTopModal('#createStaffGroup');
      })
      .catch((err) => {
        console.error(err);
        this.snackBar.open('Failed to create user role, Make sure you inserted valid values.', 'close', {duration: 2500});
      });
  }

  toggleTopModal(el: string) {
    $(el).fadeToggle('fast');
  }

  deleteImage() {
    this.editForm.patchValue({imageUrl: null});
    this.db.updateStaff(this.editForm.value)
      .catch(err => console.error(err));
  }
}
