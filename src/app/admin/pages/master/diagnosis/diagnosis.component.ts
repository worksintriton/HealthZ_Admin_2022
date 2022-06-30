import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef,ChangeDetectorRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Table } from "primeng/table";

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR:any;
  value1:any;

  S_Date: any;
  E_Date: any;
  Diagnosis : any = '';
  user_type_value : string = '';
  date_and_time : string = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  pet_type_list : any = [];
  pet_type_id : string = '';
  shremove:boolean=false;

  update_button : boolean;
  selectedimgae : any;
  @ViewChild("tt") table: Table;
  @ViewChild('imgType', { static: false }) imgType: ElementRef;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,private cdRef: ChangeDetectorRef
  ) { 
    // login_status
if(this.getFromLocal("login_status") === false)
{
  this.router.navigate(['login']);
}
  }

  ngOnInit(): void {

    this.Diagnosis = '';
    this.user_type_value = '0';
    // this.user_type_img = 'http://18.237.123.253:3000/api/uploads/template.jpg';
    this.pet_type_id = '';
    this.update_button = true;
    this.listpettype();
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

  listpettype() {
    this._api.diagnosis_getlist().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
        this.pet_type_list = response.Data;
        console.log(this.pet_type_list);
      }
    );
  }


  cancel() {
    this.update_button = true;
    this.Diagnosis= undefined;
  }
  ////// Inserting Data

  Insert_pet_type_details() {


    if(this.Diagnosis.trim() == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please Enter the Diagnosis")
    }else{
    let a = {
      'diagnosis' : this.Diagnosis,
     'date_and_time' : new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
      };
    console.log(a);
    this._api.diagnosis_create(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      if ( response.Code === 200 ) {
        //alert('Added Successfully');
        this.showSuccess("Added Successfully")
      }else {
        //alert(response.Message);
        this.showError(response.Message)
      }
      this.ngOnInit();
    }
  );
    }
  }


  Edit_pet_type_details(){
    if(this.Diagnosis == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please Enter Diagnosis")
    }else{
    let a = {
      '_id' : this.pet_type_id,
      'diagnosis' : this.Diagnosis,
     };
    this._api.diagnosis_edit(a).subscribe(
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
      '_id' : data
     };
    console.log(a);
    this._api.diagnosis_delete(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully")
      this.ngOnInit();
    }
  );
  }


  Editcompanydetailsdata(data) {
    this.update_button = false;
    this.pet_type_id = data._id;
    this.Diagnosis = data.diagnosis ;
  }

    filter_date() {
      var date =new Date();
      if ( this.E_Date != undefined && this.S_Date != undefined) {
        // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
        var edate=this.E_Date;
        if((this.S_Date.getTime()<=date.getTime()) && (this.S_Date.getTime()<=edate.getTime())){
        let yourDate= this.E_Date.setDate(this.E_Date.getDate() + 1);
        let element: HTMLElement = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
        element.click();
        let a = {
          "fromdate":this.datePipe.transform(new Date(this.S_Date),'yyyy-MM-dd'),
          "todate" : this.datePipe.transform(new Date(yourDate),'yyyy-MM-dd')
          }
        console.log(a);
        this._api.diagnosis_filter(a).subscribe(
          (response: any) => {
            console.log(response.Data);
            this.rows = response.Data;
          }
        );
      }
      else{
        alert("Please Select the Start date less than or Equal to End date");
       
      }
    }
      else{
        this.showWarning("Please select the Start Date and End Date");
        //alert('Please select the Start Date and End Date');
      }
     
    }
    refersh(){
      this.listpettype();this.E_Date = undefined ; this.S_Date = undefined;
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
    research(){
      if(this.searchQR!=''){
        this.shremove=true;
      }
    }
  research1()
  {
    if(this.searchQR==''){
      this.shremove=false;
    }

   
  }
  remove(){
 
    this.searchQR='';
   
      this.shremove=false;
    
  }
}
