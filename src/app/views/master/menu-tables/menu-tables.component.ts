import { Component, OnInit } from '@angular/core';
import {faPencilAlt, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {FormBuilder, Validators} from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-menu-tables',
  templateUrl: './menu-tables.component.html',
  styleUrls: ['./menu-tables.component.scss']
})
export class MenuTablesComponent implements OnInit {
  editIcon = faPencilAlt;
  addIcon = faPlusCircle;
  deleteIcon = faTrashAlt;
  // create form
  createTableForm = this.formBuilder.group({
    name: [null, Validators.required],
    capacity : [null, Validators.required]
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

  }
  // form getters
  get name() {
    return this.createTableForm.get('name');
  }
  get capacity() {
    return this.createTableForm.get('capacity');
  }

  // toggle modal
  toggleModal(id) {
    $(id).fadeToggle(id);
  }

  addTable() {
    console.log(this.createTableForm.value);
  }
}
