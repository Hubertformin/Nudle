// import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {SettingsService} from '../../../providers/settings.service';
// import {FormBuilder, Validators} from '@angular/forms';
// import {MatSnackBar} from '@angular/material';
// import {faChevronLeft, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
// import {NudleService} from '../../../providers/nudle.service';
// import {ajax} from 'rxjs/ajax';
//
// @Component({
//   selector: 'app-create-branch',
//   templateUrl: './create-branch.component.html',
//   styleUrls: ['./create-branch.component.scss']
// })
// export class CreateBranchComponent implements OnInit, AfterViewInit {
//   public online: boolean;
//   backIcon = faChevronLeft;
//   infoIcon = faInfoCircle;
//   branchForm = this.formBuilder.group({
//     name: [''],
//     location: [''],
//     defaultBranch: [false]
//   });
//   //
//   latitude: number;
//   longitude: number;
//
//   constructor(private config: SettingsService, private formBuilder: FormBuilder,
//               private snackBar: MatSnackBar, private nudleService: NudleService) { }
//
//   back() {
//     window.history.back();
//   }
//
//   ngOnInit() {
//     /*this.nudleService.watchLocation()
//       .subscribe(data => {
//         console.log(data);
//       });*/
//     window.navigator.geolocation.getCurrentPosition((position) => {
//       this.latitude = position.coords.latitude;
//       this.longitude = position.coords.longitude;
//     });
//   }
//
//   ngAfterViewInit(): void {
//     window.addEventListener('online', (event) => this.online = true);
//     window.addEventListener('offline', (event) => this.online = false);
//     // get postions
//   }
//   get branch_name() {
//     return this.branchForm.get('name');
//   }
//   get location() {
//     return this.branchForm.get('location');
//   }
//   get defaultBranchForm() {
//     return this.branchForm.get('defaultBranch');
//   }
//   get defaultBranch() {
//     return this.config.get('default_branch_index');
//   }
//
//   addBranch() {
//     if (this.branch_name.value === '' || this.location.value === '') {
//       this.snackBar.open('Please insert a valid name and location', 'close', {duration: 3000});
//       return;
//     }
//     // if this was set as default branch, uncheck default
//     if (this.defaultBranchForm.value === true) {
//     }
//     // TODO: Implement create branch...
//     // reset form and notifier user
//     this.branchForm.patchValue({name: '', location: ''});
//     this.snackBar.open('Branch created!', 'close', {duration: 3000});
//   }
//
//   getAddress() {
//     // Geo location api key.. AIzaSyC8K2tIvm1xfjrFiiyrYULA-hSPje9xFHk
//     ajax('https://api.opencagedata.com/geocode/v1/json?q=' + this.latitude + '+ ' + this.longitude + '&key=4a4fa22da162426180ad840565615d40')
//       .subscribe(data => {
//         console.log(data);
//       });
//   }
// }
