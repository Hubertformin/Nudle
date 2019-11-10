import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../providers/settings.service';
import * as $ from 'jquery';
import {FormBuilder, Validators} from '@angular/forms';
import {DbService} from '../../../providers/db.service';
import {ExpenseModel} from '../../../data-access/entities';
import {AuthService} from '../../../providers/auth.service';
import {MatSnackBar} from '@angular/material';
import {faChevronDown, faEye, faPencilAlt, faPlusCircle, faTrash} from '@fortawesome/free-solid-svg-icons';
import {SatDatepickerInputEvent} from 'saturn-datepicker';

@Component({
  selector: 'app-purchases',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, AfterViewInit {
  // icons
  addIcon = faPlusCircle;
  editIcon = faPencilAlt;
  deleteIcon = faTrash;
  dropDownIcon = faChevronDown;

  expenses: ExpenseModel[] = [];
  // form
  expenseForm = this.fb.group({
    category: [null],
    staff: [null, Validators.required],
    amount: [null, Validators.required],
    description: [null]
  });

  constructor(public config: SettingsService, private db: DbService, private fb: FormBuilder, private auth: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // patch form
    this.expenseForm.patchValue({staff: this.auth.getAuthUser()});
    // get records of today
    this.db.getExpenseByDate('today')
      .then(data => {
        this.expenses = [...data];
        // console.log(this.expenses);
      });
  }
  get authUser_name() {
    return this.auth.getAuthUser().firstName;
  }
  get amount_control() {
    return this.expenseForm.get('amount');
  }

  get totalCostOfExpenses(): number {
    let total = 0;
    this.expenses.forEach(el => {
      total += Number(el.amount);
    });
    return total;
  }

  toggleModal(id: string) {
    $(id).fadeToggle('fast');
  }

  getExpenses(event: MouseEvent, date: string) {
    if (date === 'all') {
      this.db.getAllExpenses()
        .then(data => {
          $('ul.list  li').removeClass('active');
          $(event.target).addClass('active');
          this.expenses = [...data];
        });
    } else {
      this.db.getExpenseByDate(date)
        .then(data => {
          $('ul.list  li').removeClass('active');
          $(event.target).addClass('active');
          this.expenses = [...data];
          // set active class
        });
    }
  }

  addExpense() {
    // validation
    // if (this.category_control.invalid) {
    //   this.snackBar.open('Please select a category', 'close', {duration: 3800});
    //   return;
    // }
    if (this.amount_control.invalid) {
      this.snackBar.open('Please add an amount', 'close', {duration: 3800});
      return;
    }
    // else
    this.db.addExpense(this.expenseForm.value)
      .then((data) => {
          this.expenses = [data, ...this.expenses];
          this.toggleModal('#simpleExpense');
          this.expenseForm.reset(); // reset form
      }).catch(err => {
      this.snackBar.open('Failed to create expense', 'close', {duration: 3800});
    });
  }

  deleteExpense(id: number) {
    if (confirm('Delete this item?')) {
      this.db.deleteExpense(id)
        .then(() => {
          this.expenses = this.expenses.filter(el => el.id !== id);
        });
    }
  }

  onDateSelected(event: SatDatepickerInputEvent<unknown>) {
    // get date intervals...
    const startDate = (event.value as any).begin;
    const endDate = (event.value as any).end;
    // console.log(event.value);
    this.db.getExpenseByDateRange(startDate.toISOString(), endDate.toISOString())
      .then(data => {
        this.expenses = [...data];
        // set active class
      });
  }
}
