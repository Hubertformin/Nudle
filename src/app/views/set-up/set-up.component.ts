import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {SettingsService} from '../../providers/settings.service';
import {MatSnackBar, MatStepper} from '@angular/material';
import * as locale from 'countrycitystatejson';
import {Directories} from '../../../../api/modules/directories-module';
import {ElectronService} from '../../providers/electron.service';
import * as fs from 'fs';
import {Router} from '@angular/router';
import {DbService} from '../../providers/db.service';
import {AuthService} from '../../providers/auth.service';

interface PrinterInfo {
  // Docs: http://electronjs.org/docs/api/structures/printer-info
  description: string;
  isDefault: boolean;
  name: string;
  status: number;
}

@Component({
  selector: 'app-set-up',
  templateUrl: './set-up.component.html',
  styleUrls: ['./set-up.component.scss']
})
export class SetUpComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  regionFormGroup;
  organizationFormGroup;
  accountFormGroup;
  checkIcon = faCheck;
  // region
  supportedLocales: any[];
  selectedCountry: any;
  statesModel;
  cityModel;
  currencyModel;
  printersList: PrinterInfo[];
  finishFormGroup;
  finishingLoader: boolean;

  constructor(private _formBuilder: FormBuilder, private db: DbService, public config: SettingsService, private electron: ElectronService, private snackBar: MatSnackBar,
               private authService: AuthService) {}

  ngOnInit() {
    this.regionFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      currency: ['']
    });
    this.organizationFormGroup = this._formBuilder.group({
      company_name: ['', Validators.required],
      company_address: [''],
      company_email: [''],
      company_website: [''],
      company_phone: [''],
      company_phone_code: '',
      company_logo_path: ''
    });
    // account form group
    this.accountFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: '',
      email: '',
      gender: '',
      group: null,
      permissions: null,
      isActive: true,
      isManager: true,
      phoneNumber: '',
      userName: '',
      password: ['', Validators.required]
    });
    // last page form group
    this.finishFormGroup = this._formBuilder.group({
      defaultPrinterName: '',
    });
    // CEMAC countries and nigeria supported for now..
    this.supportedLocales = Directories.getSupportedLocales().map(lc => locale.getCountryByShort(lc));
    // get printers list
    this.printersList = JSON.parse(this.electron.ipcRenderer.sendSync('get-printers'));
  }
  ngAfterViewInit(): void {
    // get admin group
    this.db.getAllStaffGroups()
        .then(data => {
          const admin = data.find(el => el.isRoot);
          // patch form
          if (admin) {
            this.accountFormGroup.patchValue({group: admin, permissions: admin.permissions});
          }
        });
  }

  stepChanged(event: StepperSelectionEvent) {
    console.log(event);
  }
  openLink(url: string) {
    this.electron.shell.openExternal(url);
  }
  encodeUrl(url: string) {
    return encodeURI(url.replace(/ /g, '-'));
  }
  get setup_phone_code() {
    return this.organizationFormGroup.get('company_phone_code');
  }
  get email() {
    return this.accountFormGroup.get('email');
  }

  // country selected
  countrySelected(e) {
    this.selectedCountry = this.supportedLocales.find((el: any) => {
      return el.name === e;
    });
    this.statesModel = Object.keys(this.selectedCountry.states); // get array of states form country-state data
    this.currencyModel = this.selectedCountry.currency; // get currency from country-state data
    // set the following config if the country select is modified...
    // this.config.set('company_country', e);
    // this.config.set('company_currency', this.selectedCountry.currency);
    this.organizationFormGroup.patchValue({company_phone_code: this.selectedCountry.phone});
    this.regionFormGroup.patchValue({currency: this.selectedCountry.currency});
  }

  stateSelected(value) {
    this.cityModel = this.selectedCountry.states[value];
    // this.config.set('company_state', value);
  }
  citySelected(value) {
    // this.config.set('company_city', value);
  }

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
        // fs.createReadStream(file.path).pipe(fs.createWriteStream(`${Directories.RESOURCE_DIR}/company_logo.png`));
        // saving path to settings file
        this.organizationFormGroup.patchValue({company_logo_path: file.path});
        // set the image url to current uploaded image
        // @ts-ignore
        document.querySelector('#logo_img').src = URL.createObjectURL(file);
      } catch (e) {
        console.error(e);
        this.snackBar.open('Unable to set company logo', 'close', {duration: 2500});
      }
    }
  }
  save() {}

  finishSetup() {
    this.finishingLoader = true;
    const region_input = this.regionFormGroup.value, organization_input = this.organizationFormGroup.value,
        account_input = this.accountFormGroup.value, finish_input = this.finishFormGroup.value;
    console.log(region_input);
    console.log(organization_input);
    console.log(account_input);
    console.log(finish_input);
    // saving details
    //
    this.config.setKeys({
      company_country: region_input.country,
      company_state: region_input.state,
      company_city: region_input.city,
      company_currency: region_input.currency,
      company_name: organization_input.company_name,
      company_email: organization_input.company_email,
      company_phone: organization_input.company_phone,
      company_address: organization_input.company_address,
      company_website: organization_input.company_website,
      country_phone: organization_input.company_phone_code,
      printer_name: finish_input.defaultPrinterName
    });
    // upload image
    if (organization_input.company_logo_path) {
      fs.createReadStream(organization_input.company_logo_path).pipe(fs.createWriteStream(`${Directories.RESOURCE_DIR}/company_logo.png`));
    }
    // saving user input
    this.db.addStaff(account_input)
        .then((user) => {
          // save app config state to true
          this.config.set('applicationConfigured', true);
          // authenticate user directly
          this.authService.login(user);
        })
        .catch(err => {
          // TODO: Logger
          this.finishingLoader = false;
          console.error(err);
        });
  }
}
