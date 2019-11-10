import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { faPencilAlt, faCog} from '@fortawesome/free-solid-svg-icons';
import {SettingsService} from '../../../providers/settings.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import * as fs from 'fs';
import * as path from 'path';
import * as concat from 'concat-stream';
import {Directories} from '../../../../../api/modules/directories-module';
import {ImagePipe} from '../../../pipes/image.pipe';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, AfterViewInit, OnDestroy {
  configIcon = faCog;
  editIcon = faPencilAlt;
  editState: boolean;  // hold edit mode state of form
  /**
   * check out reactive forms @ https://angular.io/guide/reactive-forms
   * */
  editForm = this.formBuilder.group({
    company_name: [null, Validators.required],
    company_address: [null, Validators.required],
    company_phone: [null],
    company_website: [null],
    company_portal: [null],
    company_email: [null]
  });
  // for file upload
  logo_img = {path: '', size: ''};

  constructor(public config: SettingsService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.editState = false;
    // console.log(localization.getCountryByShort('CM'));
    this.editForm.patchValue({
      company_name: this.companyName,
      company_address: this.companyAddress,
      company_website: this.config.get('company_website'),
      company_phone: this.config.get('company_phone'),
      company_portal: this.config.get('company_portal'),
      company_email: this.config.get('company_email')
    });
  }
  /**
   * @method ngAfterViewInit
   * this method is called after view has been initialized.
   * */
  ngAfterViewInit(): void {
    try {
      const img_path = `${Directories.RESOURCE_DIR}/company_logo.png`;
      const data = fs.readFileSync(img_path);
      const file_arraay = img_path.split('.');
      let ext = file_arraay[file_arraay.length - 1];
      if (ext === 'svg') { ext = 'svg+xml'; }
      // insert image
      // @ts-ignore
      document.querySelector('#logo_img').src =  'data:image/' + ext + ';base64,' + data.toString('base64');

    } catch (e) {
      // TODO: Logger
    }
  }
  // getters and setters
  // get company name from settings
  get companyName(): string {
    return this.config.get('company_name');
  }
  // get company's address from settings
  get companyAddress(): string {
    return this.config.get('company_address');
  }
  // get currency from settings
  get currency(): string {
    return this.config.get('company_currency');
  }
  // get country from settings
  get country(): string {
    return this.config.get('company_country');
  }
  // get state from settings
  get state(): string {
    return this.config.get('company_state');
  }
  // get city from settings..
  get city(): string {
    return this.config.get('company_city');
  }
  // get country phone code from settings
  get country_phone(): string {
    return this.config.get('country_phone');
  }
  // get company logo url from settings
  get company_log_url(): string {
    return this.config.get('company_logo_url');
  }
  // save company's settings to file.
  save() {
    // save settings if the form input are modified
    if (this.editForm.dirty) {
      // this.editForm.patchValue({company_website: 'http://' + this.editForm.get('company_website').value});
      this.config.setKeys(this.editForm.value);
    }
  }

  // when and Image is imported from file explorer
  onImageSelect($event) {
    const file = $event.target.files[0];
    // This only runs if the user imported a file(image)
    if (typeof file === 'object') {
      console.log(file);
      // reject if the file size is greater than 8MB
      if (file.size > 8000000) {
        this.snackBar.open('Consider uploading image less than 8MB', 'close', {duration: 2500});
        return;
      }
      try {
        // upload file to folder location
        fs.createReadStream(file.path).pipe(fs.createWriteStream(`${Directories.RESOURCE_DIR}/company_logo.png`));
        // saving path to settings file
        this.config.set('company_logo_url', `${Directories.RESOURCE_DIR}/company_logo.png`);
        // set the image url to current uploaded image
        // @ts-ignore
        document.querySelector('#logo_img').src = URL.createObjectURL(file);
      } catch (e) {
        console.error(e);
        this.snackBar.open('Unable to set company logo', 'close', {duration: 2500});
      }
    }
  }

  // delete company's logo
  removeImage() {
     if (confirm('Confirm removal of company logo?')) {
       fs.unlink(`${Directories.RESOURCE_DIR}/company_logo.png`, (err) => {
         if (err) {
           console.error(err);
           this.snackBar.open('Failed to delete company logo', 'close', {duration: 2500});
           return;
         }
         // reset setting/
         this.config.set('company_logo_url', '');
         // setting view imageUrl to default image
         // @ts-ignore
         document.querySelector('#logo_img').src = '../../../../assets/images/company-avatar.png';
       });
     }
  }
  // save settings on exit component
  // this method is called when a view's component is about-config to be destroyed.
  ngOnDestroy(): void {
    this.save();
  }
}
