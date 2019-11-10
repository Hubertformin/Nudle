import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatMenuModule,
  MatInputModule,
  MatButtonModule,
  MatDividerModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatCardModule,
  MatSelectModule,
  MatExpansionModule,
  MatDialogModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatRippleModule, MatTooltipModule, MatTabsModule, MatRadioModule,
  MatDatepickerModule, NativeDateModule, MAT_DATE_FORMATS, MatStepperModule, MatProgressSpinnerModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatMenuModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    DragDropModule,
    MatRippleModule,
    MatTooltipModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatRadioModule,
    MatDatepickerModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatMomentDateModule,
    NativeDateModule,
    MatStepperModule,
      MatProgressSpinnerModule
  ],
  exports: [
    CommonModule,
    MatMenuModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    DragDropModule,
    MatRippleModule,
    MatTooltipModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatRadioModule,
    MatDatepickerModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatMomentDateModule,
    NativeDateModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
  ],
})
export class MaterialComponentsModuleModule { }
