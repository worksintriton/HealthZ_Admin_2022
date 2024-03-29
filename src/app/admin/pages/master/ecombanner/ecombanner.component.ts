import { Component, OnInit, Inject, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiService } from '../../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Table } from "primeng/table";

@Component({
  selector: 'app-ecombanner',
  templateUrl: './ecombanner.component.html',
  styleUrls: ['./ecombanner.component.css']
})
export class EcombannerComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR: any;
  Tittle: any='';
  Description: any;
  selectedtype: any;
  type: any = [];
  S_Date: any;
  E_Date: any;
  shremove:boolean=false;
  Validation: any;
  selectedimgae: any;
  img_path: string = '';
  list: any;
  id:any;
  edit_t:boolean = false;
  @ViewChild('imgType', { static: false }) imgType: ElementRef;
  @ViewChild("tt") table: Table;
  constructor(
    private toastr:ToastrManager,
    private router: Router,
    private location: Location,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    
    private _api: ApiService,
    private http: HttpClient,
    private datePipe: DatePipe,private cdRef: ChangeDetectorRef
  ) { 
    // login_status
if(this.getFromLocal("login_status") === false)
{
  this.router.navigate(['login']);
}
  }

  ngOnInit(): void {
    this.listecomBanner();
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
  listecomBanner() {
    //console.log("list");
    this._api.ecombanner_list().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.list = response.Data;
      }
    );
  }
  validation() {
    if (this.Tittle == undefined || this.Tittle == '' || this.img_path == undefined) {
      this.Validation = false;
      console.log(this.Validation)
    }
    else {
      this.Validation = true;
      console.log(this.Validation)
    }
  }
  cancel() {
    this.edit_t = false;
    this.img_path= undefined;
    this.Tittle= undefined;
  }

  create() {
    this.validation();
    if (this.Tittle.trim() == '') {
      // alert("Please enter valid inputs")
      this.showWarning("Please Enter the Valid Inputs")
    }else if(this.img_path == '') {
      this.showWarning("Please Enter the Valid Inputs")
    } else {
      let a = {
        "img_path": this.img_path,
        "img_title": this.Tittle,
        "img_describ": this.Description,
        "img_index": 4,
        "show_status": true,
        "date_and_time": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      }
      console.log(a);
      this._api.ecombanner_add(a).subscribe(
        (response: any) => {
          console.log(response);
          if (response.Code === 200) {
            // alert('Added Successfully');
            this.showSuccess("Added Successfully");
            this.Tittle='';
            this.img_path='';
            this.ngOnInit();
          } else {
            this.showError(response.Message);
            // alert(response.Message);
          }
        }
      );
    }
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
        console.log(width, height);
        if (width == 800 && height == 350) {
          let d = this.selectedimgae.size / 100000;
          if (d < 10) {
            this.addfiles1();
          } else {
            // alert('Please upload the file below 1 MB');
            this.showWarning("Please upload the file below 400 KB")
            this.imgType.nativeElement.value = "";
          }
        }
        else {
          this.showWarning("Please upload the file size 800 * 350")
          // alert('Please upload the file size 100 * 100');
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
    this.http.post(this.imgUrl , fd)
      .subscribe((res: any) => {
        console.log(res);
        this.img_path = res.Data;
      });
  }


  delete(data) {
    let a = {
      '_id': data
    };
    console.log(a);
    this._api.ecombanner_delete(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        //alert('Deleted Successfully');
        this.showSuccess("Deleted Successfully")
        this.ngOnInit();
      }
    );
  }
  edit(item){
    this.edit_t = true;
    this.id = item._id;
    this.img_path = item.img_path;
    this.Tittle = item.img_title;
    this.Description = item.img_describ;
  }
  update() {
    if (this.img_path == '') {
      //alert("Please enter valid inputs")
      this.showWarning("Please Enter the Valid Inputs");
    }
    else if(this.Tittle.trim() == '') {
      this.showWarning("Please Enter the Valid Inputs");
    } else {
      let a = {
        "_id": this.id,
        "img_path": this.img_path,
        "img_title": this.Tittle.toLowerCase(),
        "img_describ": this.Description,
        "img_index": 4,
        "show_status": true,
        "date_and_time":new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),

      }
      console.log(a);
      this._api.ecombanner_update(a).subscribe(
        (response: any) => {
          console.log(response);
          if (response.Code === 200) {
            //alert('Update Successfully');
            this.showSuccess("Update Successfully")
            this.ngOnInit();
            this.edit_t = false;
            this.id = undefined;
            this.img_path = undefined;
            this.Tittle = undefined;
            this.Description = undefined;
          } else {
            this.showError(response.Message);
            // alert(response.Message);
          }
        }
      );
    }
  }

  filter_date() {
    var date = new Date();
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
      this._api.ecomFilter_date(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          this.list = response.Data;
        }
      );
    }
    else{
      // alert('Please select the Start Date and End Date');
      alert("Please select the Start Date and End Date")
    }
    }
    else{
      this.showWarning("Please select the Start Date and End Date")
      //alert('Please select the Start Date and End Date');
    }
   
  }
  refersh(){
    this.listecomBanner();this.E_Date = undefined ; this.S_Date = undefined;
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
