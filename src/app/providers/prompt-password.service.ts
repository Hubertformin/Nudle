import {Component, Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {faUserLock} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

interface DialogData {
  password: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromptPasswordService implements DialogData {
  /**
   * @property {string} title: Title of the prompt password dialog modal
   * @property {string} password: Contains the password inputted by user
   */
  title: string;
  password: string;

  constructor(private dialog: MatDialog, private authService: AuthService) {}
  /**
   * @method
   * @name openDialog
   * @summary opens password modal
   * @param {string} title: The title of dialog modal
   * @return void
   * */
  openDialog(title: string): Observable<any> {
    this.title = title;
    const dialogRef = this.dialog.open(PromptPasswordDialogComponent, {
      width: '332px',
      data: {title: this.title, password: this.password}
    });

    return new Observable<any>(observer => {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          observer.next(result === this.authService.getAuthUser().password);
        } else {
          observer.error('no password set');
        }
        observer.complete();
      });
    });
  }
}

@Component({
  selector: 'app-prompt-password-dialog',
  template: `<h4 mat-dialog-title class="text-red text-center">{{data.title}}</h4>
  <div mat-dialog-content class="text-center pt-5">
    <mat-form-field style="width: 100%;" appearance="outline" floatLabel="always">
      <mat-label>Enter your password to confirm</mat-label>
      <input type="password"
             (keyup.enter)="onClose($event.target.value)" placeholder="Enter your password to confirm" matInput [(ngModel)]="data.password" cdkFocusInitial />
      <fa-icon class="text-theme-primary" [icon]="lockIcon" matSuffix></fa-icon>
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
  <span>
    <button class="btn-border" mat-button (click)="onClose()">Cancel</button>
  </span>
    <span class="ml-2">
    <button class="btn-border" mat-button [mat-dialog-close]="data.password">Confirm</button>
  </span>
  </div>
  `,
})
export class PromptPasswordDialogComponent {
  /**
   * @property lockIcon:
   */
  lockIcon = faUserLock;

  constructor(
    public dialogRef: MatDialogRef<PromptPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onClose(password = null): void {
    this.dialogRef.close(password);
  }

}
