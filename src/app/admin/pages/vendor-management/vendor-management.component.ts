import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core'; import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Table } from "primeng/table";

@Component({
  selector: 'use',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.css']
})
export class VendorManagementComponent implements OnInit {

  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  S_Date: any;
  E_Date: any;
  rows = [];
  searchQR: any;
  value1: any;
  Main_list: any;
  @ViewChild("tt") table: Table;
  shremove: boolean = false;
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
  listpettype() {
    this._api.vendor_details_list1().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
        this.Main_list = response.Data;
        console.log(this.Main_list);
      }
    );
  }

  verify(status, id) {
    let a = {
      '_id': id,
      'profile_verification_status': status,
    };
    this._api.vendor_details_edit(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        //alert("Updated Successfully");
        this.showSuccess("Updated Successfully")
        this.ngOnInit();
      }
    );
  }
  vendor_form() {
    this.router.navigateByUrl('/admin_panel/Vendor_form')
  }

  addnewVendor() {
    this.router.navigateByUrl('/admin/Vendor_form');
  }

  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): any {
    return this.storage.get(key);
  }

  doc_form() {
    this.router.navigateByUrl('/admin/Service_Provider_form')
    this.saveInLocal('fun_type', 'create');
  }

  // filter_date() {
  //   if (this.E_Date != undefined && this.S_Date != undefined) {
  //     // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
  //     let yourDate = this.E_Date.setDate(this.E_Date.getDate() + 1);

  //     let a = {
  //       "fromdate": this.datePipe.transform(new Date(this.S_Date), 'yyyy-MM-dd'),
  //       "todate": this.datePipe.transform(new Date(yourDate), 'yyyy-MM-dd')
  //     }
  //     let element: HTMLElement = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
  //     element.click();
  //     this._api.vendor_detailsfilter_date(a).subscribe(
  //       (response: any) => {
  //         console.log(response.Data);
  //         this.rows = response.Data;
  //       }
  //     );
  //   }
  //   else {
  //     this.showWarning("Please select the Start Date and End Date");
  //     //alert('Please select the Start Date and End Date');
  //   }

  // }


  filter_date() {
    var date = new Date()
    if (this.E_Date != undefined && this.S_Date != undefined) {
      // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
      var edate = this.E_Date;
      if ((this.S_Date.getTime() <= date.getTime()) && (this.S_Date.getTime() <= edate.getTime())) {
        let yourDate = this.E_Date.setDate(this.E_Date.getDate() + 1);

        let a = {
          "fromdate": this.datePipe.transform(new Date(this.S_Date), 'yyyy-MM-dd'),
          "todate": this.datePipe.transform(new Date(yourDate), 'yyyy-MM-dd')
        }
        let element: HTMLElement = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
        element.click();
        console.log(a);
        this._api.doctor_detailsfilter_date(a).subscribe(
          (response: any) => {
            console.log(response.Data);
            this.rows = response.Data;
          }
        );
      }

      else {
        // alert("Please Select the Start date less than or Equal to End date");
        this.showWarning("Start Date Should Be Less Than Or Equal To The End Date")

      }
    }
    else {
      this.showWarning("Please Select The Start Date And End Date");
      // alert('Please select the Start Date and End Date');
    }

  }


  refersh() {
    this.listpettype();
    this.E_Date = undefined; this.S_Date = undefined;
  }
  del(data) {
    let a = {
      '_id': data
    };
    console.log(a);
    this._api.vendor_delete(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        //alert('Deleted Successfully');
        this.showSuccess("Deleted Successfully")
        this.ngOnInit();
      }
    );
  }
  goToLink1(url: string) {
    window.open(url, "_blank");
  }
  research() {
    console.log(this.table)
    if (this.searchQR != '') {
      this.shremove = true;
    }


  }
  research1() {

    if (this.searchQR == '') {
      this.shremove = false;
      this.ngOnInit();
    }


  }
  remove() {
    this.searchQR = '';
    this.shremove = false;
  }

  viewProduct(id) {
    this.saveInLocal("Vendor_id", id);
    this.router.navigateByUrl('admin/view-vendor-products');
  }
  view_details(item) {
    this.saveInLocal('fun_type', 'create');
    this.saveInLocal('view_detail_data', item);
    this.saveInLocal('view_detail', 'vendor');
    this.router.navigateByUrl('/admin/View_details')
    window.scrollTo(0, 0);


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
