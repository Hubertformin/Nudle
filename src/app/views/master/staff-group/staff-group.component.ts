import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {DbService} from '../../../providers/db.service';
import {StaffGroupEntity} from '../../../data-access/entities';

@Component({
  selector: 'app-staff-group',
  templateUrl: './staff-group.component.html',
  styleUrls: ['./staff-group.component.scss']
})
export class StaffGroupComponent implements OnInit {
  /**
   * @property createForm: creating and instance of angular's reactive api form group so as to collectively get states of input
   * Learn more about-config reactive forms: https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   * Generating and grouping data with form builder,
   * Learn more about-config angular Reactive-Form builders: https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   * */
  groupForm = this.formBuilder.group({
    id: [null],
    name: ['', Validators.required],
    isRoot: [false],
    permissions: this.formBuilder.group({
      USERS_CREATE: [false],
      USERS_READ: [false],
      USERS_DELETE: [false],
      USERS_UPDATE: [false],
      INVOICES_CREATE: [false],
      INVOICES_READ: [false],
      INVOICES_DELETE: [false],
      INVOICES_UPDATE: [false],
      BRANCH_CREATE: [false],
      BRANCH_READ: [false],
      BRANCH_DELETE: [false],
      BRANCH_UPDATE: [false],
      MENU_ITEMS_CREATE: [false],
      MENU_ITEMS_READ: [false],
      MENU_ITEMS_DELETE: [false],
      MENU_ITEMS_UPDATE: [false],
      REPORTS_CREATE: [false],
      REPORTS_READ: [false],
      REPORTS_DELETE: [false],
      REPORTS_UPDATE: [false],
      INVENTORY_CREATE: [false],
      INVENTORY_READ: [false],
      INVENTORY_DELETE: [false],
      INVENTORY_UPDATE: [false]
    })
  });
  // set the action mode of the form, by default would be set to true, meaning the action of the form is to create a new staff group,
  // set to false, is you want the action mode of the form to update instead...
  FORM_ACTION_CREATE: boolean;
  PARENT_VIEW_INDEX: number;

  // index of array from parent, to be used back by parent for update.

  constructor(
    private formBuilder: FormBuilder,
    private db: DbService
  ) {}
  /**
   * @methods
   * @summary common getters used for validation in template
   * */
/**
 * @method
 * @name ngOnInit
 * @summary angular's life cycle hook listener method
 * */
  ngOnInit() {
    // set default mode to create
    this.toggleCreateMode();
  }

  // GETTERS
  get group_name() {
    return this.groupForm.get('name');
  }
  /**
   * @method
   * @name toggleCreateMode
   * @summary Set the form to default mode (this.FORM_ACTION_CREATE to true)
   * */
  toggleCreateMode() {
    // reset the form, should in case editMode was toggles
    this.groupForm.reset();
    this.groupForm.patchValue({isRoot: false});
    // switch form's action
    this.FORM_ACTION_CREATE = true;
  }
  /**
   * @method
   * @name toggleEditMode
   * @summary this method uses the same form as createStaffGroup, but it initializes the staff form and change the action buttons, to update
   * */
  toggleEditMode(id: number, parentViewIndex?: number) {
    if (parentViewIndex) {
      this.PARENT_VIEW_INDEX = parentViewIndex;
    }
    // Get selected row's group data...
    this.db.getStaffGroup(id)
      .then((group) => {
        // initialize form with group's data
        this.groupForm.patchValue({
          id: group.id,
          isRoot: group.isRoot,
          name: group.name,
          permissions: group.permissions
        });
        // switch form's action
        this.FORM_ACTION_CREATE = false;
      });
  }
  /**
   * @method
   * @name createStaffGroup
   * @summary when the modal's save button is clicked
   * */
  private createStaffGroup(): Promise<StaffGroupEntity> {
    // saving data to database
    return this.db.addStaffGroup(this.groupForm.value);
  }
  /**
   * @method
   * @name updateStaffGroup
   * @summary update staff group.
   * */
  private updateStaffGroup(): Promise<StaffGroupEntity> {
    // saving data to database
    return this.db.updateStaffGroup(this.groupForm.value);
    // updating and sending form data to parent component.
  }
  /**
   * @method
   * @name formAction
   * @summary This method is fired, when user clicks save on form modal, and depending on this.FORM_ACTION_CREATE property, depends if form would create or update
   * */
  formAction(): Promise<StaffGroupEntity> {
    if (this.FORM_ACTION_CREATE) {
      return this.createStaffGroup();
    } else {
      return this.updateStaffGroup();
    }
  }
}
