import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ValidatorService } from '../../../validator.services';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { MouseEvent } from '@agm/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctoredit',
  templateUrl: './doctoredit.component.html',
  styleUrls: ['./doctoredit.component.css']
})
export class DoctoreditComponent implements OnInit {

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
    console.log(this.address);

  }

  stage1 = false;
  stage2 = false;


  options = {
    types: [],
    componentRestrictions: { country: 'IN' }
  }

  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  zoom: number = 8;
  base_lat: number = 11.1271;
  base_lng: number = 78.6569;
  location_lat: number = 11.1271;
  location_lng: number = 78.6569;
  Name: any;
  Education: any;
  Specialization: any;
  completion: any;
  Experience: any;
  handled: any;
  Specializationarray: any = [];
  years: any = [];
  address: any;
  tittle: any;
  tittle_idError: any;
  Clinic_Name: any;
  Latitude: any;
  Longitude: any;
  f_date: any;
  T_date: any;
  CName: any;

  thumbnail_image: any;

  selectedimgae: any;
  Exp: any = [
    { "y": "1+ years" },
    { "y": "5+ years" },
    { "y": "10+ years" },
    { "y": "15+ years" },
    { "y": "20+ years" },
    { "y": "25+ years" },
    { "y": "30+ years" },
  ];




  Experiencearray: any = [];
  Completionarray: any = [];
  handledarray: any = [];
  uploadedFiles: any[] = [];
  @ViewChild('imgType', { static: false }) imgType: ElementRef;
  img_path: any = undefined;
  clinic_arr: any = [];
  govt_arr: any = [];
  certificate_arr: any = [];
  photo_arr: any = [];
  Validation: any;
  Validation2: any;
  Email: any;
  Phone: any;
  phone_idError: any;
  Email_id: any;
  Email_idError: any;
  userid: any = undefined;
  type: any;
  detail: any;
  dropdownslist: any;
  consultancy_fees: any;
  // Fdatearr: any;
  // ldatearr: any;


  user_id = '';

  ///New Params///

  clinic_number: any = '';
  doctor_id: any = '';
  about_doctor: any = '';
  communication_type: any = '';
  year_list = [];
  city_name = '';
  constructor(
    private toastr: ToastrManager,
    private location: Location,
    private router: Router,
    private ValidatorService: ValidatorService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    public datepipe: DatePipe
  ) {

    let current_year = (new Date()).getFullYear();
    console.log(current_year);
    current_year = current_year + 1;
    for (let a = 0; a < 50; a++) {
      current_year = current_year - 1;
      this.year_list.push(current_year);
    }
    console.log(this.year_list);


    this.stage1 = true;
    this._api.petdetails_dropdownslist().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.dropdownslist = response.Data;
        console.log(this.dropdownslist);
      }
    );
  }

  ngOnInit(): void {
    this.type = this.getFromLocal('fun_type');
    console.log(this.type);
    if (this.type == 'edit') {
      this.detail = this.getFromLocal('view_detail_data');
      console.log(this.detail)
      this.userid = this.detail.user_id._id;
      this.Email = this.detail.user_id.user_email;
      this.Phone = this.detail.user_id.user_phone;
      this.tittle = this.detail.user_id.first_name;
      this.Name = this.detail.user_id.last_name;
      this.Clinic_Name = this.detail.clinic_name;
      this.address = this.detail.clinic_loc;
      this.Latitude = this.detail.clinic_lat;
      this.Longitude = this.detail.clinic_long;
      this.location_lat = this.detail.clinic_lat;
      this.location_lng = this.detail.clinic_long;
      this.base_lat = this.location_lat;
      this.base_lng = this.location_lng;
      this.Completionarray = this.detail.education_details;
      this.Experiencearray = this.detail.experience_details;
      this.Specializationarray = this.detail.specialization;
      this.handledarray = this.detail.pet_handled;
      this.clinic_arr = this.detail.clinic_pic;
      this.certificate_arr = this.detail.certificate_pic;
      this.govt_arr = this.detail.govt_id_pic;
      this.photo_arr = this.detail.photo_id_pic;
      this.thumbnail_image = this.detail.thumbnail_image;
      this.consultancy_fees = +this.detail.consultancy_fees;
      this.clinic_number = this.detail.clinic_no;
      this.doctor_id = this.detail.doctor_id;
      this.communication_type = this.detail.communication_type;
      this.about_doctor = this.detail.doctor_info;
      this.city_name = this.detail.city_name;

    }
    for (let i = 1980; i < 2020; i++) {
      this.years.push({ "y": i + 1 })
    }
  }
  cancel() {
    this.router.navigateByUrl('/admin/Doctor')
  }
  addSpecialization() {

    if (this.Specializationarray.length == 0) {
      if (this.Specialization != undefined && this.Specialization != '') {
        let obj = { "specialization": this.Specialization }
        this.Specializationarray.push(obj);
        this.Specialization = undefined;
      }
    } else {
      var checks = '0';
      for (let a = 0; a < this.Specializationarray.length; a++) {
        if (this.Specialization == this.Specializationarray[a].specialization) {
          checks = '1';
        }
        if (a == this.Specializationarray.length - 1) {
          if (checks == '1') {
            alert('this specialization already exist')
          } else {
            if (this.Specialization != undefined && this.Specialization != '') {
              let obj = { "specialization": this.Specialization }
              this.Specializationarray.push(obj);
              this.Specialization = undefined;
            }
          }
        }
      }
    }





  }
  remove_Specialization(i) {
    this.Specializationarray.splice(i, 1);

  }
  addcompletion() {

    if (this.completion != undefined && this.completion != '' && this.Education != undefined && this.Education != '') {
      let obj = { "education": this.Education, "year": this.completion }
      this.Completionarray.push(obj);
      this.completion = undefined;
      this.Education = undefined;
    }
    else {
      // alert("Pleasefill all the fields")
      this.showWarning("Please fill all the fields");
    }
  }
  remove_completion(i) {
    this.Completionarray.splice(i, 1);

  }
  addExperience() {

    if (this.CName != undefined && this.CName != '' && this.f_date != undefined && this.T_date != undefined) {
      if (+this.f_date < +this.T_date) {
        let temp = 0;
        temp = +this.T_date - +this.f_date;
        console.log(temp);
        let obj = { "company": this.CName, "from": this.f_date, "to": this.T_date, "yearsofexperience": temp }
        this.Experiencearray.push(obj);
        this.CName = undefined;
        this.f_date = undefined;
        this.T_date = undefined;
      } else {
        // alert(" Please Select The From Date Less Than The To Date");
        this.showWarning(" Please Select The From Date Less Than The To Date");
      }


    }
    else {
      // this.toastr.warningToastr("Pleasefill all the fields")
      this.showWarning("Please fill all the fields");
    }
  }
  remove_Experience(i) {
    this.Experiencearray.splice(i, 1);

  }
  addhandled() {

    console.log(this.handled);
    if (this.handledarray.length == 0) {
      if (this.handled != undefined && this.handled != '') {
        let obj = { "pet_handled": this.handled }
        this.handledarray.push(obj);
        this.handled = undefined;
      }
    } else {
      console.log("Test");
      var checks = '0';
      console.log(this.handledarray.length);

      for (let a = 0; a < this.handledarray.length; a++) {
        console.log(this.handledarray[a].pet_handled, this.handled);
        if (this.handledarray[a].pet_handled == this.handled) {
          checks = '1';
        }
        if (a == this.handledarray.length - 1) {
          console.log(checks);
          if (checks == '1') {
            alert('pethandle already added');
          } else {
            if (this.handled != undefined && this.handled != '') {
              let obj = { "pet_handled": this.handled }
              this.handledarray.push(obj);
              this.handled = undefined;
            }
          }
        }
      }
    }
  }


  remove_handled(i) {
    this.handledarray.splice(i, 1);

  }
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles)
    }

  }

  //////Additional Calling Funcation//////
  fileupload(event, str) {
    console.log("this.width")
    this.selectedimgae = event.target.files[0];
    console.log(this.selectedimgae.size / 100000);
    let fr = new FileReader();
    fr.onload = () => { // when file has loaded
      var img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        console.log(width, height);
        let d = this.selectedimgae.size / 100000;
        console.log(d);
        if (d < 21) {
          this.addfiles(str);
        } else {
          // alert('Please upload the file below 1 MB');
          this.showWarning("Please upload the file below 2 MB");
          this.imgType.nativeElement.value = "";
        }
      };
      img.src = fr.result as string; // The data URL
    };
    fr.readAsDataURL(this.selectedimgae);
    // clear the value after upload
  }


  addfiles(data: any) {
    const fd = new FormData();
    fd.append('sampleFile', this.selectedimgae, this.selectedimgae.name);
    this.http.post(this.imgUrl, fd)
      .subscribe((res: any) => {
        console.log(res);
        this.img_path = res.Data;
        if (data == 'Clinic') {
          let obj = { "clinic_pic": this.img_path }
          this.clinic_arr.push(obj);
          this.img_path = undefined;

        }
        if (data == 'Govt') {
          let obj = { "govt_id_pic": this.img_path }
          this.govt_arr.push(obj);
          this.img_path = undefined;

        }
        if (data == 'Photo') {
          let obj = { "photo_id_pic": this.img_path }
          this.photo_arr.push(obj);
          this.img_path = undefined;
          console.log(this.photo_arr)

        }
        if (data == 'Certificate') {
          let obj = { "certificate_pic": this.img_path }
          this.certificate_arr.push(obj);
          this.img_path = undefined;

        }
        if (data == 'thumbnail_img') {
          this.thumbnail_image = this.img_path;
          this.img_path = undefined;
        }
      });


  }
  remove_clinic_img(i) {
    this.clinic_arr.splice(i, 1);
  }
  remove_govt_img(i) {
    this.govt_arr.splice(i, 1);
  }
  remove_photo_img(i) {
    this.photo_arr.splice(i, 1);
  }
  remove_Certificate_img(i) {
    this.certificate_arr.splice(i, 1);
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
  validation() {

    if (this.Name == undefined || this.Name == '' || this.Email == undefined || this.Email == '' || this.tittle == undefined || this.tittle == '' || this.Completionarray.length == 0 || this.Specializationarray.length == 0 || this.handledarray.length == 0 || this.clinic_arr.length == 0 || this.photo_arr.length == 0 || this.govt_arr.length == 0 || this.certificate_arr.length == 0 || this.Clinic_Name == undefined || this.Clinic_Name == '' || this.address == undefined || this.address == '' || this.Latitude == undefined || this.Longitude == '' || this.Latitude == '' || this.Longitude == undefined) {
      this.Validation = false;
      console.log(this.Validation)
    }
    else {
      this.Validation = true;
      console.log(this.Validation)
    }
  }
  validation_2() {
    if (this.clinic_number == undefined || this.clinic_number == '' || this.consultancy_fees == undefined || this.consultancy_fees == '' || this.certificate_arr.length == 0 || this.govt_arr.length == 0 || this.Specializationarray.length == 0 || this.thumbnail_image == undefined || this.clinic_arr.length == 0 || this.photo_arr.length == 0 || this.Phone.length != 10 || this.doctor_id == undefined || this.doctor_id == '' || this.Clinic_Name == undefined || this.Clinic_Name == '' || this.address == undefined || this.address == '' || this.city_name == undefined || this.city_name == '') {
      this.Validation2 = false;
      console.log(this.Validation)
    }
    else {
      this.Validation2 = true;
      console.log(this.Validation)
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
        "user_email_verification": false,
        "ref_code": "",
        "user_phone": this.Phone,
        "otp": 123456,
        "user_type": 4,
        "date_of_reg": "" + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss'),
        "mobile_type": 'Admin',
        "user_status": "complete"
      };
      console.log(a);
      this._api.user_create(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            this.userid = response.Data.user_details._id;
            console.log(this.userid)
            // alert('Added Successfully');
            this.showSuccess("Added Successfully")
            this.stage1 = false;
            this.stage2 = true;
          } else {
            this.showError(response.Message);
            //alert(response.Message);
          }
        }
      );
    }
  }
  create() {
    let a = {
      "certificate_pic": this.certificate_arr,
      "city_name": this.city_name,
      "clinic_lat": this.Latitude,
      "clinic_loc": this.address,
      "clinic_long": this.Longitude,
      "clinic_name": this.Clinic_Name,
      "clinic_no": this.clinic_number,
      "clinic_pic": this.clinic_arr,
      "communication_type": this.communication_type,
      "consultancy_fees": this.consultancy_fees,
      "date_and_time": "" + this.datepipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss'),
      "doctor_id": this.doctor_id,
      "doctor_info": this.about_doctor,
      "dr_name": this.Name,
      "dr_title": "Dr",
      "education_details": this.Completionarray,
      "experience_details": this.Experiencearray,
      "govt_id_pic": this.govt_arr,
      "mobile_type": "Admin",
      "pet_handled": this.handledarray,
      "photo_id_pic": this.photo_arr,
      "profile_status": true,
      "profile_verification_status": "Not verified",
      "signature": "",
      "specialization": this.Specializationarray,
      "user_id": this.userid,
      "thumbnail_image": this.thumbnail_image,
    }

    console.log(a);
    // this.validation();
    this.Validation = true;
    if (this.Validation == false) {
      // alert("Please enter valid inputs");
      this.showWarning("Please enter valid inputs");
    } else {
      let a = {
        "certificate_pic": this.certificate_arr,
        "city_name": this.city_name,
        "clinic_lat": this.Latitude,
        "clinic_loc": this.address,
        "clinic_long": this.Longitude,
        "clinic_name": this.Clinic_Name,
        "clinic_no": this.clinic_number,
        "clinic_pic": this.clinic_arr,
        "communication_type": this.communication_type,
        "consultancy_fees": this.consultancy_fees,
        "date_and_time": "" + this.datepipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss'),
        "doctor_id": this.doctor_id,
        "doctor_info": this.about_doctor,
        "dr_name": this.Name,
        "dr_title": "Dr",
        "education_details": this.Completionarray,
        "experience_details": this.Experiencearray,
        "govt_id_pic": this.govt_arr,
        "mobile_type": "Admin",
        "pet_handled": this.handledarray,
        "photo_id_pic": this.photo_arr,
        "profile_status": true,
        "profile_verification_status": "Not verified",
        "signature": "",
        "specialization": this.Specializationarray,
        "user_id": this.userid,
        "thumbnail_image": this.thumbnail_image,
      }
      console.log(a);
      this._api.doctor_details_create(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            // alert('Added Successfully');
            this.showSuccess("Added Successfully");
            this.router.navigateByUrl('/admin/doctor/doctor_list')
          } else {
            this.showError(response.Message);
            //alert(response.Message);
          }
        }
      );
    }
  }

  EmailidChange(data) {
    this.Email_id = data;
    this.Email_idError = this.ValidatorService.emailValidator(this.Email_id);
  }
  PhoneChange(data) {
    this.Email_id = data;
    this.Email_idError = this.ValidatorService.emailValidator(this.Email_id);
  }
  FirstnameChange(data) {
    this.tittle = data;
    this.tittle_idError = this.ValidatorService.stringValidator(this.tittle);
  }
  LastnameChange(data) {
    this.Email_id = data;
    this.Email_idError = this.ValidatorService.emailValidator(this.Email_id);
  }


  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }
  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }
  back() {
    this.location.back();
  }
  getFromLocal(key): any {
    return this.storage.get(key);
  }


  markerDragEnd($event: MouseEvent) {
    this.location_lat = Number($event.coords.lat);
    this.location_lng = Number($event.coords.lng);
    this.base_lat = this.location_lat;
    this.base_lng = this.location_lng;
    this.Latitude = this.location_lat;
    this.Longitude = this.location_lng;
    this._api.location_details(this.location_lat, this.location_lng).subscribe(async data => {
      this.address = await data['results'][0]['formatted_address'];
    });
  }

  edit() {
    this.validation_2();
    console.log(this.thumbnail_image)
    this.Validation = true;
    if (this.Validation2 == false) {
      // alert("Please enter valid inputs");
      this.showWarning("Please Enter Valid inputs");
    } else {
      let a = {
        "certificate_pic": this.certificate_arr,
        "city_name": this.city_name,
        "clinic_lat": this.Latitude,
        "clinic_loc": this.address,
        "clinic_long": this.Longitude,
        "clinic_name": this.Clinic_Name,
        "clinic_no": this.clinic_number,
        "clinic_pic": this.clinic_arr,
        "communication_type": this.communication_type,
        "consultancy_fees": this.consultancy_fees,
        "date_and_time": "" + this.datepipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss'),
        "doctor_id": this.doctor_id,
        "doctor_info": this.about_doctor,
        "dr_name": this.Name,
        "dr_title": "Dr",
        "education_details": this.Completionarray,
        "Specialization": this.Specializationarray,
        "experience_details": this.Experiencearray,
        "govt_id_pic": this.govt_arr,
        "mobile_type": "Admin",
        "pet_handled": this.handledarray,
        "photo_id_pic": this.photo_arr,
        "profile_status": true,
        "profile_verification_status": "Not verified",
        "signature": "",
        "specialization": this.Specializationarray,
        "user_id": this.userid,
        "thumbnail_image": this.thumbnail_image,
      }
      console.log(a);
      this._api.doctor_details_create(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            // alert('Added Successfully');
            this.showSuccess("Doctor Details Added Successfully");
            this.router.navigateByUrl('/admin/doctor/doctor_list')
          } else {
            this.showError(response.Message);
            //alert(response.Message);
          }
        }
      );
    }
    // if (this.clinic_number != '') {
    //   if ((this.clinic_number.length >= 10) && (this.clinic_number == "0000000000")) {
    //     let a = {
    //       "certificate_pic": this.certificate_arr,
    //       "city_name": this.city_name,
    //       "clinic_lat": this.Latitude,
    //       "clinic_loc": this.address,
    //       "clinic_long": this.Longitude,
    //       "clinic_name": this.Clinic_Name,
    //       "clinic_no": this.clinic_number,
    //       "clinic_pic": this.clinic_arr,
    //       "communication_type": this.communication_type,
    //       "consultancy_fees": this.consultancy_fees,
    //       "date_and_time": "" + this.datepipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss'),
    //       "doctor_id": this.doctor_id,
    //       "doctor_info": this.about_doctor,
    //       "dr_name": this.Name,
    //       "dr_title": "Dr",
    //       "education_details": this.Completionarray,
    //       "experience_details": this.Experiencearray,
    //       "govt_id_pic": this.govt_arr,
    //       "mobile_type": "Admin",
    //       "pet_handled": this.handledarray,
    //       "photo_id_pic": this.photo_arr,
    //       "profile_status": true,
    //       "profile_verification_status": "Not verified",
    //       "signature": "",
    //       "specialization": this.Specializationarray,
    //       "user_id": this.userid,
    //       "thumbnail_image": this.thumbnail_image,
    //     }


    //   }
    //   else { this.showWarning("Please Enter Minimum 10 Characters "); }
    // }
    // else {
    //   this.showWarning("Please Enter the Clinic Number");
    // }
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


  edit_1() {
    this.validation_1();
    if (this.Validation == false) {
      // alert("Please enter valid inputs");
      // this.showWarning("Please enter valid inputs");
    } else {
      let a = {
        _id: this.userid,
        "first_name": this.tittle,
        "last_name": this.Name,
        "user_email": this.Email,
        "user_phone": this.Phone,
      };
      console.log(a);
      this._api.user_edit(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            this.userid = response.Data._id;
            console.log(this.userid)
            // alert('Added Successfully');
            this.showSuccess("Update Successfully")
            this.stage1 = false;
            this.stage2 = true;
          } else {
            this.showError(response.Message);
            //alert(response.Message);
          }
        }
      );
    }
  }
}
