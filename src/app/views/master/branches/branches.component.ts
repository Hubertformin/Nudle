// import { Component, OnInit} from '@angular/core';
// import {faCheck, faChevronDown, faMapMarker, faPencilAlt, faStoreAlt} from '@fortawesome/free-solid-svg-icons';
// import {faTrashAlt, faCheckSquare} from '@fortawesome/free-regular-svg-icons';
// import {SettingsService} from '../../../providers/settings.service';
// import {PromptPasswordService} from '../../../providers/prompt-password.service';
// import {MatSnackBar} from '@angular/material';
// import {NudleService} from '../../../providers/nudle.service';
// import {DbService} from '../../../providers/db.service';
// import {BranchModel} from '../../../data-access/entities';
//
// @Component({
//   selector: 'app-branches',
//   templateUrl: './branches.component.html',
//   styleUrls: ['./branches.component.scss']
// })
// export class BranchesComponent implements OnInit {
//   /**
//    * @props icons
//    * */
//   branchIcon = faStoreAlt;
//   editIcon = faPencilAlt;
//   deleteIcon = faTrashAlt;
//   locationIcon = faMapMarker;
//   checkIcon = faCheckSquare;
//   dropDownIcon = faChevronDown;
//   activeBranchIcon = faCheck;
//   branches: BranchModel[];
//
//   constructor(private config: SettingsService,
//               private nudleService: NudleService, private promptPassword: PromptPasswordService, private snackBar: MatSnackBar,
//               private db: DbService
//   ) { }
//   /**
//    * @method ngOnInit
//    * This method is called when the view is initialized
//    * */
//   ngOnInit() {
//     this.db.getBranches()
//       .subscribe(branches => this.branches = branches);
//   }
//   /**
//    * @method deleteBranch
//    * delete a branch from settings file.
//    * */
//   deleteBranch(i: number) {
//     if (window.confirm('Are you sure you want to delete this branch? All menu items, staff members saved in this branch would be deleted too.')) {
//       this.promptPassword.openDialog('Enter password to confirm')
//         .subscribe((valid) => {
//           // if password is correct
//           /**
//            * Delete online first....
//            * */
//           if (valid) {
//             // TODO: IMPLEMENT DELETES WITH BACKEND
//           } else {
//             this.snackBar.open('Wrong password', 'close', {duration: 3500});
//           }
//         });
//     }
//   }
// }
