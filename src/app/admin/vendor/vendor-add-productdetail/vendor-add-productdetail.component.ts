import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-add-productdetail',
  templateUrl: './vendor-add-productdetail.component.html',
  styleUrls: ['./vendor-add-productdetail.component.css']
})
export class VendorAddProductdetailComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;


  vendor_list: any;

  searchQR: any;
  S_Date: any;
  E_Date: any;
  list: any;
  rows: any;
  Catagories_list: any;


  cat_id : any;
  condition : any;
  cost : any;
  price_type : any;
  product_discription : any;
  product_img : any;
  product_name: any;
  threshould : any;
  thumbnail_image : any;
  vendor_id : any;
  addition_detail : any;
  addtion_info_text = '';

  Thmp_list: any = [];


  selectedimgae: any;
  img_path: string = undefined;

  @ViewChild('imgType1', { static:false}) imgType: ElementRef;
  @ViewChild('imgType2', { static:false}) imgType2: ElementRef;


constructor(
    private formBuilder:FormBuilder,
    private toastr:ToastrManager,
    private router: Router,
    private location: Location,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private _api: ApiService,
    private http: HttpClient,
    private datePipe: DatePipe,
    ){
// login_status
if(this.getFromLocal("login_status") === false)
{
  this.router.navigate(['login']);
}
    }



  ngOnInit(): void {
    this.vendorlist();
    this.catagorieslist();
    this.addition_detail = [];

  }
 saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): any {
    return this.storage.get(key);
  }

  vendorlist() {
    this._api.vendor_details_list().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
        this.vendor_list = response.Data;
        console.log(this.vendor_list);
      }
    );
  }


  catagorieslist() {
    this._api.product_cate_list().subscribe(
      (response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
        this.Catagories_list = response.Data;
        console.log(this.Catagories_list);
      }
    );
  }

        //////Additional Calling Funcation//////
        fileupload2(event) {
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
              if (width == 200 && height == 200) {
                let d = this.selectedimgae.size / 100000;
                if (d < 10) {
                  this.addfiles2();
                } else {
                  //alert('Please upload the file below 1 MB');
                  this.showWarning("Please upload the file below 1 MB");
                  this.imgType2.nativeElement.value = "";
                }
              }
              else {
                this.showWarning("Please upload the file size 200 * 200");
                // alert('Please upload the file size 100 * 100');
                this.imgType2.nativeElement.value = "";
              }
            };
            img.src = fr.result as string; // The data URL
          };
          fr.readAsDataURL(this.selectedimgae);
          // clear the value after upload
        }
  
  
        addfiles2() {
          const fd = new FormData();
          fd.append('sampleFile', this.selectedimgae, this.selectedimgae.name);
          this.http.post(this.imgUrl , fd)
            .subscribe((res: any) => {
              console.log(res);
              this.thumbnail_image = res.Data;
              this.imgType.nativeElement.value = "";
            });
        }

  create(){
    let a  = {
      "addition_detail": this.addition_detail,
      "cat_id": this.cat_id._id,
      "condition":this.condition,
      "cost": +this.cost,
      "date_and_time": ""+new Date(),
      "mobile_type": "Admin",
      "price_type": this.price_type,
      "product_discription": this.product_discription,
      "product_img": this.Thmp_list,
      "product_name": this.product_name,
      "threshould":""+this.threshould,
      "thumbnail_image": this.thumbnail_image,
      "vendor_id": this.vendor_id._id
    }
    console.log(a);

    this._api.product_details_create(a).subscribe(
      (response: any) => {
        console.log(response);
        if(response.Code == 500){
          this.showError('Something went wrong. pls refresh and try again');
        }else{
          this.showSuccess('Product Added successfully');
          this.router.navigateByUrl('/admin/vendor/vendor_productdetail');
        }
      }
      );
  }

  addimg() {
    if (this.img_path != undefined) {
      this.Thmp_list.push(
        {
          "product_img": this.img_path
        }
        );
      this.img_path = undefined
      console.log(this.Thmp_list);
    }
    else {
      // alert("Please choose a image");
      this.showWarning("Please choose a image")
    }
  }
  deleteimg(dynamic, i) {
    console.log(dynamic, i, this.Thmp_list)
    for (let b = 0; b < this.Thmp_list.length; b++) {
      if (this.Thmp_list[b] == dynamic) {
        //this.Location_list[i].status="true";
        this.Thmp_list.splice(b, 1);
      }
      console.log(this.Thmp_list);
    }
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
          if (width == 700   && height == 350) {
            let d = this.selectedimgae.size / 100000;
            if (d < 10) {
              this.addfiles1();
            } else {
              //alert('Please upload the file below 1 MB');
              this.showWarning("Please upload the file below 1 MB");
              this.imgType.nativeElement.value = "";
            }
          }
          else {
            this.showWarning("Please upload the file size 350 * 700");
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
          this.imgType.nativeElement.value = "";
  
        });
    }


    add_addition_info(){
      this.addition_detail.push(this.addtion_info_text);
      this.addtion_info_text = '';
    }

    delete_addition_info(data,index){
      this.addition_detail.splice(index, 1);
    }

 

}
