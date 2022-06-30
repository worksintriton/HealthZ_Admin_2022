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
  selector: 'app-healthissue',
  templateUrl: './healthissue.component.html',
  styleUrls: ['./healthissue.component.css']
})
export class HealthissueComponent implements OnInit {

  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR:any;
  value1:any;
  shremove:boolean=false;

  health_issue_img : any;



  S_Date: any;
  E_Date: any;
  health_issue_title : any = '';
  date_and_time : string = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  pet_type_list : any = [];
  pet_type_id : string = '';

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
    private datePipe: DatePipe,private cdRef: ChangeDetectorRef,
  ) { 
    // login_status
if(this.getFromLocal("login_status") === false)
{
  this.router.navigate(['login']);
}
  }

  ngOnInit(): void {

    this.health_issue_title = '';
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
    this._api.health_issue_type_list().subscribe(
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
    this.health_issue_title= undefined;
    this.health_issue_img='';
  }
  ////// Inserting Data

  Insert_pet_type_details() {

console.log(this.health_issue_title)
    if(this.health_issue_title.trim() == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please enter the Health Issue Type")
      this.health_issue_title='';
    }
    else if(this.health_issue_img==undefined){
      this.showWarning("Please Upload the Health Issue Image")
    }
    else{
    let a = {
      'health_issue_img' : this.health_issue_img,
      'health_issue_title' : this.health_issue_title.toLowerCase(),
      'date_and_time' : new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
      };
    console.log(a);
    this._api.health_issue_type_insert(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      if ( response.Code === 200 ) {
        //alert('Added Successfully');
        this.showSuccess("Added Successfully");
        this.health_issue_img='';
        this.ngOnInit();
      }else {
        //alert(response.Message);
        this.showError("Health Issue Already Added")
      }
     
      this.imgType.nativeElement.value = "";
    }
  );
    }
  }


  Edit_pet_type_details(){
    if(this.health_issue_title == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please enter the pet type")
    }else{
    let a = {
      '_id' : this.pet_type_id,
      'health_issue_img' : this.health_issue_img,
      'health_issue_title' : this.health_issue_title,
     };
    this._api.health_issue_type_edit(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      //alert("Updated Successfully");
      this.health_issue_img='';
      if ( response.Code === 200 ) {
        //alert('Added Successfully');
        this.showSuccess("Updated Successfully");
         this.ngOnInit();
        // this. openAddedDialog();
      }else {
        alert("Already Specialization added");
      }
      this.imgType.nativeElement.value = "";
    }
  );
    }
  }



  Deletecompanydetails(data) {
    let a = {
      '_id' : data
     };
    console.log(a);
    this._api.health_issue_type_delete(a).subscribe(
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
    this.health_issue_img = data.health_issue_img;
    this.health_issue_title = data.health_issue_title ;
  }

















    //////Additional Calling Funcation//////
    fileupload(event) {
      console.log("this.width")
      this.selectedimgae = event.target.files[0];
      console.log(this.selectedimgae.size / 100000);
      let fr = new FileReader();
      fr.onload = () => { // when file has loaded
        var img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          console.log('ADfad',width,height);
          if(width == 100 && height == 100){
            let d = this.selectedimgae.size / 100000 ;
            console.log(d);
            if(d < 10){
            this.addfiles1();
           }else{
            alert('Please upload the file below 1 MB');
            this.imgType.nativeElement.value = "";
           }
          }
          else{
            alert('Please upload the file size 100 * 100');
            this.imgType.nativeElement.value = "";
          }
        };
        img.src = fr.result as string; // The data URL
      };
      fr.readAsDataURL(this.selectedimgae);
      // clear the value after upload
    }


    addfiles1() {
    const fd = new FormData();
    fd.append('sampleFile', this.selectedimgae, this.selectedimgae.name);
    this.http.post(this.imgUrl, fd)
      .subscribe((res: any) => {
        console.log(res);
        this.health_issue_img = res.Data;
      });
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
        this._api.health_issue_type_filter_date(a).subscribe(
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
    research1(){
      if(this.searchQR==''){
        this.shremove=false;
      }
  
     
    }
    remove(){
      this.searchQR='';
   
        this.shremove=false;
      
  
    }


}
