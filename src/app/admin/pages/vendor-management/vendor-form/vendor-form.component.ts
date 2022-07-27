import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { MouseEvent } from '@agm/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ApiService } from 'src/app/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ValidatorService } from '../../../../../app/validator.services';
// import { threadId } from 'worker_threads';
@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css']
})
export class VendorFormComponent implements OnInit {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;


  public handleAddressChange(address: any) {
    this.zoom = 15;
    this.location_lat = Number(address.geometry.location.lat());
    this.location_lng = Number(address.geometry.location.lng());
    this.base_lat = this.location_lat;
    this.base_lng = this.location_lng;
    this.Latitude = this.location_lat;
    this.Longitude = this.location_lng;
    this.address = address.formatted_address;
    this.address1 = address.formatted_address;
    this.addVendorForm.patchValue({
      business_lat: this.location_lat,
      business_long: this.location_lng
    });
    console.log(this.address);
  }

  options = {
    types: [],
    componentRestrictions: { country: 'IN' }
  }

  userid: any = undefined;
  Latitude: any;
  Longitude: any;
  address: any;
  zoom: number = 8;
  base_lat: number = 11.1271;
  base_lng: number = 78.6569;
  location_lat: number = 11.1271;
  location_lng: number = 78.6569;
  addVendorForm: FormGroup;
  userForm: FormGroup;
  addmore: boolean;
  addfirst: boolean
  Validation: any;
  tittle: any;
  Email: any;
  Phone: any;
  Email_id: any;
  Email_idError: any;
  type: any;
  business_name: any;
  business_email: any;
  business: string;
  business_phone: any;
  business_reg: any;
  address1: any;
  Name: any;
  email: any;
  Contact: any;
  registration: any;
  uploadedFiles: any[] = [];
  constructor(private router: Router,
    private _api: ApiService,
    private ValidatorService: ValidatorService,
    private location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrManager) {
    // this.addVendorForm = this.formBuilder.group({
    //   _id: [''],
    //   business_reg: ['', Validators.required],
    //   business: ['', Validators.required],
    //   business_email: ['', Validators.required],
    //   business_address: ['', Validators.required],
    //   business_gallery: [''],
    //   business_lat: ['',],
    //   business_loc: ['',],
    //   business_long: ['',],
    //   business_name: ['', Validators.required],
    //   business_phone: ['', Validators.required],
    //   certifi: [''],
    //   date_and_time: [''],
    //   delete_status: [''],
    //   gov_id_proof: [''],
    //   mobile_type: [''],
    //   photo_id_proof: [''],
    //   profile_status: [''],
    //   profile_verification_status: [''],
    //   user_email: [''],
    //   user_id: [''],
    //   user_name: ['']
    // });
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_type: ['', Validators.required],
      user_email: ['', Validators.required],
      user_email_verification: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.addmore = false;
    this.addfirst = true;
  }
  // cancel() {
  //   this.router.navigateByUrl('/admin_panel/Vendor_Management')
  // }
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles)
    }

  }
  create_1() {



    this.validation_1();
    if (this.Validation == false) {
      // alert("Please enter valid inputs");
      this.showWarning("Please enter valid inputs");
    } else {
      let a = {
        "first_name": this.tittle,
        "last_name": this.Name,
        "user_email": this.Email,

        "user_phone": this.Phone,

      };
      console.log(a);
      this._api.user_create(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            this.userid = response.Data.user_details._id;
            console.log(this.userid)

            this.showSuccess("Added Successfully")
            this.addfirst = false;
            this.addmore = true;
          } else {
            this.showError(response.Message);
            //alert(response.Message);
          }
        }
      );
    }
  }
  validation() {

    if (this.business_name == undefined || this.business_name == '' || this.business_email == undefined || this.business_email == '' || this.business == undefined || this.business == '' || this.business_phone == '' || this.business_phone == undefined || this.business_reg == '' || this.business_reg == undefined || this.address1 == '' || this.address1 == undefined) {
      this.Validation = false;
      console.log(this.Validation)
    }
    else {
      this.Validation = true;
      console.log(this.Validation)
    }
  }

  validation_1() {
    if (this.tittle == undefined || this.tittle == '' || this.Name == undefined || this.Name == '' || this.Email == undefined || this.Phone == undefined || this.Email_idError == true || this.Phone == '' || this.Phone.length != 10) {
      this.Validation = false;
      console.log(this.Validation)
    }
    else {
      this.Validation = true;
      console.log(this.Validation)
    }
  }
  cancel1() {
    this.location.back();
    // this.router.navigateByUrl('/admin/Doctor')
  }
  markerDragEnd($event: MouseEvent) {
    this.location_lat = Number($event.coords.lat);
    this.location_lng = Number($event.coords.lng);
    this.base_lat = this.location_lat;
    this.base_lng = this.location_lng;
    this.Latitude = this.location_lat;
    this.Longitude = this.location_lng;
    this.addVendorForm.patchValue({
      business_lat: this.location_lat,
      business_long: this.location_lng
    });
    this._api.location_details(this.location_lat, this.location_lng).subscribe(async data => {
      this.address = await data['results'][0]['formatted_address'];
    });
  }
  EmailidChange(data) {
    this.Email_id = data;
    this.Email_idError = this.ValidatorService.emailValidator(this.Email_id);
  }

  addUser() {
    this.userForm.patchValue({
      user_email_verification: false,
      user_type: 3,
      mobile_type: "admin"
    });

    if (this.userForm.valid) {
      this._api.user_create(this.userForm.value).subscribe(data => {
        if (data['Code'] == 200) {
          this.addmore = true;
          this.addVendorForm.patchValue({
            user_email: data['Data']['user_details']['user_email'],
            user_id: data['Data']['user_details']['_id'],
            user_name: data['Data']['user_details']['first_name']
          })
          this.showSuccess(data['Message']);
        } else {
          this.showError(data['Message']);
          this.addmore = false;
        }
      })
    } else {
      this.showError("Please all fields");
    }
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }
  keydown(e: any) {
    if (e.shiftKey || e.ctrlKey || e.altKey) {

      e.preventDefault();

    } else {

      var key = e.keyCode;

      if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {

        e.preventDefault();

      }

    }
  }
  addVendor1() {
    if (this.Validation == true) {
      this._api.create_Vendor(this.addVendorForm.value).subscribe(data => {
        if (data['Code'] == 200) {
          this.showSuccess(data['Message']);
        } else {
          this.showError(data['Message']);
        }
      });
    } else {
      this.showError("Please all fields");
    }
  }


  addVendor() {



    this.validation();
    if (this.Validation == false) {
      // alert("Please enter valid inputs");
      this.showWarning("Please enter valid inputs");
    } else {
      let a = {
        "business_name": this.business_name,
        "business_email": this.business_email,
        "business": this.business,
        "business_phone": this.business_phone,
        "business_reg": this.business_reg,
        "address1": this.address1,

      };
      console.log(a);
      this._api.create_Vendor(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            // this.userid = response.Data.user_details._id;
            // console.log(this.userid)
            // alert('Added Successfully');
            this.showSuccess("Added Successfully")

          } else {
            this.showError(response.Message);
            //alert(response.Message);
          }
        }
      );

    }
  }



  updateVendor() {

  }

  showSuccess(msg) {
    this.toastr.successToastr(msg);
  }

  showError(msg) {
    this.toastr.errorToastr(msg);
  }

  showWarning(msg) {
    this.toastr.warningToastr(msg);
  }

}
