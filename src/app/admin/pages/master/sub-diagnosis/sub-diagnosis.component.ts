import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core'; import { Router } from '@angular/router';
import { ApiService } from '../../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Table } from "primeng/table";
@Component({
  selector: 'app-sub-diagnosis',
  templateUrl: './sub-diagnosis.component.html',
  styleUrls: ['./sub-diagnosis.component.css']
})
export class SubDiagnosisComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  final = [];
  rows1 = [];
  @ViewChild("td") table: Table;
  shremove: boolean = false;
  searchQR: any;
  value1: any;
  S_Date: any;
  E_Date: any;
  Diagnosis: any;
  pet_type_id: string = '';
  Sub_Diagnosis: any = '';
  user_type_value: string = '';
  date_and_time: string = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  Sub_Diagnosis_list: any = [];
  Sub_Diagnosis_id: string = '';


  update_button: boolean;
  selectedimgae: any;

  @ViewChild('imgType', { static: false }) imgType: ElementRef;

  constructor(
    private toastr: ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe, private cdRef: ChangeDetectorRef
  ) {
    // login_status
    if (this.getFromLocal("login_status") === false) {
      this.router.navigate(['login']);
    }
  }

  ngOnInit(): void {

    this.pet_type_id = '';
    this.Sub_Diagnosis = '';
    this.user_type_value = '0';
    // this.user_type_img = 'http://18.237.123.253:3000/api/uploads/template.jpg';
    this.pet_type_id = '';
    this.update_button = true;
    this.listpettype();
    this.listpetbreed();
  }
  ngAfterViewChecked() {
    if (this.table._totalRecords === 0) {
      this.table.currentPageReportTemplate = this.table.currentPageReportTemplate.replace("{first}", "0")
    } else {
      this.table.currentPageReportTemplate = this.table.currentPageReportTemplate.replace("0", "{first}")
    }
    this.cdRef.detectChanges();
  }
  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): any {
    return this.storage.get(key);
  }
  cancel() {
    this.update_button = true;
    this.Diagnosis = undefined;
    this.Sub_Diagnosis = undefined;
  }

  listpettype() {
    this._api.diagnosis_getlist().subscribe(
      (response: any) => {
        console.log("response.Data");
        console.log(response.Data);
        this.rows = response.Data;
        this.rows1 = response.Data;
        this.Diagnosis = this.rows1[0];
      }
    );
  }

  listpetbreed() {
    this._api.sub_diagnosis_getlist().subscribe(
      (response: any) => {
        console.log("Sub_Diagnosis_list");
        console.log(response.Data);
        this.final = response.Data;
        console.log(this.final);
      }
    );
  }



  ////// Inserting Data ///
  Insert_Sub_Diagnosis_details() {

    if (this.Diagnosis == null) {
      this.showWarning(" Please Select the Dignosis")
    }
    if (this.Sub_Diagnosis.trim() == '') {
      // alert("Please enter the pet breed");
      this.showWarning("Please Enter the Sub Diagnosis")
    } else {
      let a = {
        'diagnosis_id': this.Diagnosis._id,
        'sub_diagnosis': this.Sub_Diagnosis,
        'date_and_time': new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      };
      console.log(a);
      this._api.sub_diagnosis_create(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          if (response.Code === 200) {
            // alert('Added Successfully');
            this.showSuccess("Added Successfully")
          } else {
            this.showError(response.Message)
            //alert(response.Message);
          }
          this.ngOnInit();
        }
      );
    }
  }


  saverange() {
    console.log(this.Diagnosis);
  }

  Edit_Sub_Diagnosis_details() {
    if (this.Sub_Diagnosis == '') {
      //alert("Please enter the pet breed");
      this.showWarning("Please enter the pet breed")
    } else {
      let a = {
        '_id': this.Sub_Diagnosis_id,
        'diagnosis_id': this.Diagnosis._id,
        'sub_diagnosis': this.Sub_Diagnosis,
        // 'user_type_value': this.user_type_value,
      };
      this._api.sub_diagnosis_edit(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          //alert("Updated Successfully");
          this.showSuccess("Updated Successfully")
          this.ngOnInit();
        }
      );
    }
  }



  Deletecompanydetails(data) {
    let a = {
      '_id': data
    };
    console.log(a);
    this._api.sub_diagnosis_delete(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        //alert('Deleted Successfully');
        this.showSuccess("Deleted Successfully")
        this.ngOnInit();
      }
    );
  }




  Editcompanydetailsdata(data) {
    this.Sub_Diagnosis_id = data._id
    this.update_button = false;
    this.Sub_Diagnosis = data.sub_diagnosis
    this.pet_type_id = data.diagnosis_id._id;
    console.log(this.pet_type_id)
    console.log(this.rows1)
    for (let a = 0; a < this.rows1.length; a++) {
      if (this.pet_type_id == this.rows1[a]._id) {
        this.Diagnosis = this.rows1[a];
        console.log(this.rows1[a]._id)
        break
      }
    }
  }


  filter_date() {
    var date = new Date();
    if (this.E_Date != undefined && this.S_Date != undefined) {
      // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
      var edate = this.E_Date;
      if ((this.S_Date.getTime() <= date.getTime()) && (this.S_Date.getTime() <= edate.getTime())) {
        let yourDate = this.E_Date.setDate(this.E_Date.getDate() + 1);
        let element: HTMLElement = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
        element.click();
        let a = {
          "fromdate": this.datePipe.transform(new Date(this.S_Date), 'yyyy-MM-dd'),
          "todate": this.datePipe.transform(new Date(yourDate), 'yyyy-MM-dd')
        }
        console.log(a);
        this._api.sub_diagnosis_filter(a).subscribe(
          (response: any) => {
            console.log(response.Data);
            this.final = response.Data;
          }
        );
      }
      else {
        // alert("Please Select the Start date less than or Equal to End date");
        this.showWarning("Please Select the Start date less than or Equal to End date");

      }
    }
    else {
      //alert('Please select the Start Date and End Date');
      this.showWarning("Please select the Start Date and End Date")
    }

  }
  refersh() {
    this.listpetbreed();
    this.E_Date = undefined; this.S_Date = undefined;
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
  research() {
    if (this.searchQR != '') {
      this.shremove = true;
    }


  }
  research1() {
    if (this.searchQR == '') {
      this.shremove = false;
    }


  }
  remove() {
    this.searchQR = '';
    this.shremove = false;
  }


}
