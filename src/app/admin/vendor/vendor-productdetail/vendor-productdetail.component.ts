import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Table } from "primeng/table";

@Component({
  selector: 'app-vendor-productdetail',
  templateUrl: './vendor-productdetail.component.html',
  styleUrls: ['./vendor-productdetail.component.css']
})
export class VendorProductdetailComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  @ViewChild("tt") table: Table;

  searchQR: any;
  S_Date: any;
  E_Date: any;
  list: any;


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrManager,
    private router: Router,
    private location: Location,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private _api: ApiService,
    private http: HttpClient,
    private datePipe: DatePipe, private cdRef: ChangeDetectorRef
  ) { }



  ngOnInit(): void {

    this._api.product_details_list().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.list = response.Data.reverse();
      }
    );

  }
  ngAfterViewChecked() {
    if (this.table._totalRecords === 0) {
      this.table.currentPageReportTemplate = this.table.currentPageReportTemplate.replace("{first}", "0")
    } else {
      this.table.currentPageReportTemplate = this.table.currentPageReportTemplate.replace("0", "{first}")
    }
    this.cdRef.detectChanges();
  }
  back() {
    this.location.back();
  }

  filter_date() {
    if (this.E_Date != undefined && this.S_Date != undefined) {
      // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
      let yourDate = this.E_Date.setDate(this.E_Date.getDate() + 1);

      let a = {
        "fromdate": this.datePipe.transform(new Date(this.S_Date), 'yyyy-MM-dd'),
        "todate": this.datePipe.transform(new Date(yourDate), 'yyyy-MM-dd')
      }
      let element: HTMLElement = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
      element.click();
      this._api.product_details_filter_date(a).subscribe(
        (response: any) => {
          console.log(response.Data);
          this.list = response.Data;
        }
      );
    }
    else {
      this.showWarning("Please select the Start Date and End Date");
      //alert('Please select the Start Date and End Date');
    }

  }
  refersh() {
    this.E_Date = undefined; this.S_Date = undefined;
  }



  update() {

  }
  cancel() {

  }

  delete(data) {
    let a = {
      '_id': data
    };
    console.log(a);
    this._api.product_details_delete(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        //alert('Deleted Successfully');
        this.showSuccess("Deleted Successfully");
        this.ngOnInit();
      }
    );
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


  makeTDeal(_id, today_deal) {
    const data = {
      _id: _id,
      today_deal: today_deal
    }
    this._api.product_details_edit(data).subscribe(data => {
      if (data['Code'] == 200) {
        this.showSuccess(data['Message']);
        this.refersh();
      } else {
        this.showError(data['Message']);
      }
    });
  }

  addproduct_details() {
    this.router.navigateByUrl('/admin/vendor/vendor_add_productdetail');
  }

  editproduct_details(data) {
    this.saveInLocal('product_detail', data);
    this.router.navigateByUrl('/admin/vendor/vendor_edit_productdetail');
  }

  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): any {
    return this.storage.get(key);
  }

}
