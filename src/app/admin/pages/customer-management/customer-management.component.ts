import { Component, OnInit, Inject, ElementRef ,ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiService } from '../../../api.service';
import { DatePipe } from '@angular/common';
import { ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { environment } from '../../../../environments/environment';
import { ExcelService } from '../../../excel.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Table } from "primeng/table";

declare var $: any;

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  @ViewChild("tt") table1: Table;
  rows = [];
  searchQR: any;
  value1: any;
  user_list: any;
  S_Date: any;
  E_Date: any;
  shremove:boolean=false;
  saveAsExcelFile: any;
  excelData: any[] = [];
  c_list: any = [];
  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private _api: ApiService,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private cdRef: ChangeDetectorRef

  ) {
    // login_status
if(this.getFromLocal("login_status") === false)
{
  this.router.navigate(['login']);
}
   }
  @ViewChild('TABLE') table: ElementRef;
  ngOnInit(): void {
    this.rows = [{ type: "Dog", name: "dog1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" },
    { type: "Cat", name: "cat1" }];
    this.list();


  }
  ngAfterViewChecked() {
    if (this.table1._totalRecords === 0) {
    this.table1.currentPageReportTemplate = this.table1.currentPageReportTemplate.replace("{first}", "0")
    } else {
    this.table1.currentPageReportTemplate = this.table1.currentPageReportTemplate.replace("0", "{first}")
    }
    this.cdRef.detectChanges();
    }
  // ngAfterViewInit(): void {
  //   if (this.table1.totalRecords === 0) {
  //     this.table1.currentPageReportTemplate = this.table1.currentPageReportTemplate.replace("{first}", "0")
  //   }
  //   else {
  //     this.table1.currentPageReportTemplate = this.table1.currentPageReportTemplate.replace("0", "{first}")
  //     }
  // }
 

  list() {
    this._api.user_list().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
        this.user_list = response.Data;
        console.log(this.user_list);
        this.get_c_list();
      }
    );
  }
  pet_view(item) {
    window.scrollTo(0, 0);
    let a = {
      'user_id': item._id
    };
    console.log(a)
    this._api.single_user_detail(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        this.saveInLocal('pet_list', response.Data);
        this.router.navigateByUrl('/admin/Pet_list')
      }
    );


  }
  view_details(item) {
    this.saveInLocal('fun_type', 'create');
    window.scrollTo(0, 0);
    let a = {
      'user_id': item._id
    };
    this._api.single_user_detail(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        this.saveInLocal('view_detail_data', response.Data);
        this.saveInLocal('view_detail', 'User');
        this.router.navigateByUrl('/admin/View_details')
      }
    );


  }
  Delete(data) {
    let a = {
      '_id': data
    };
    console.log(a);
    this._api.user_delete(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        //alert('Deleted Successfully');
        this.showSuccess("Deleted Successfully");
        this.ngOnInit();
      }
    );
  }


  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): any {
    return this.storage.get(key);
  }
  service_form() {
    this.saveInLocal('fun_type', 'create');
    this.router.navigateByUrl('/admin/Customer_create')
  }

  edit_details(item) {
    this.saveInLocal('view_detail_data', item);
    this.saveInLocal('fun_type', 'edit');
    this.router.navigateByUrl('/admin/Customer_create')

  }

  filter_date() {
    var date=new Date();
    if (this.E_Date != undefined && this.S_Date != undefined) {
      // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
      var edate=this.E_Date;
      if((this.S_Date.getTime()<=date.getTime()) && (this.S_Date.getTime()<=edate.getTime())){
      let yourDate = this.E_Date.setDate(this.E_Date.getDate());
      let element: HTMLElement = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
      element.click();
      let a = {
        "fromdate": this.datePipe.transform(new Date(this.S_Date), 'yyyy-MM-dd'),
        "todate": this.datePipe.transform(new Date(yourDate), 'yyyy-MM-dd')
      }
      console.log(a);
      this._api.user_filter_date(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          this.user_list = response.Data;
          this.get_c_list();
        }
      );
    }
    else{
      alert("Please Select the Start date less than or Equal to End date");
     
    }
    }
    else {
      //alert('Please select the Start Date and End Date');
      this.showWarning("Please select the Start Date and End Date")
    }

  }
  refersh() {
    this.list();this.E_Date = undefined ; this.S_Date = undefined;
  }

  head = [['S.No', 'Name', 'Email', 'Phone', 'Created Date', 'Device type']]


  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'customerlists.xlsx');
  }
  get_c_list() {
    this.c_list = this.user_list.reverse();
    console.log(this.c_list)
    this.excelData = this.c_list
    // for (let a = 0; a < this.c_list.length; a++) {
    //   let data = {
    //   }
    //   this.excelData.push(this.c_list)
    // }

  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.excelData, 'Customer_List');
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
    console.log(this.table)
    if(this.searchQR!=''){
      this.shremove=true;
    }
console.log(this.table1)
  
  }
  research1(){
 
    if(this.searchQR==''){
      this.shremove=false;
      this.ngOnInit();
    }

   
  }
  remove(){
    this.searchQR='';
    this.shremove=false;
  }

}
