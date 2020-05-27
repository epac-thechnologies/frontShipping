import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { TokenStorage } from 'src/app/services/authentification/token-storage.service';
import * as html2pdf from 'html2pdf.js';
import { ConfirmationService } from 'primeng/api/';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

interface LoadTag {
  loadId: number;
  quantity: number;
  operator: string;
  load_Date: Date;
  quantityProduced: number;
}

@Component({
  selector: 'app-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.scss']
})
export class AssemblyComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  orderInfo: any = [];
  loadTagsToShow:any[] | null;
  partInfo: Promise<any> | null;

  loadTagForm: FormGroup;
  submitted = false;
  orderStatus: any;
  shippingIsComplete = false;

  packingSlipForm = new FormGroup({
    quantity:new FormControl(null, [Validators.required]),
  });
  @ViewChild('loadTagToPrint', { static: false }) loadTagToPrint: ElementRef;
  @ViewChild('packingSlip', {static:false}) packingSlip: ElementRef;


  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router, private dataService: DataService, private tokenStorage: TokenStorage, private confirmationService: ConfirmationService,private toastr: ToastrService) {
    this.loadTagForm = this.formBuilder.group({
      tickets: new FormArray([])
    });



  }

  ngOnInit() {
    this.orderInfo = this.location.getState();
    console.log('sent order', this.orderInfo);
    if (this.orderInfo['navigationId'] == 1) {
      console.log("empty");
        this.router.navigate(['/security-label']);
    } else {
      console.log("M3ebi", this.orderInfo);
      this.loadTagsToShow = this.orderInfo.ordre.loadtags;
      this.packingSlipForm = new FormGroup({
        shipDate: new FormControl(new Date(), [Validators.required]),
        quantity:new FormControl(this.orderInfo.ordre.produced, [Validators.required]),
        notes: new FormControl(null),
      });

      this.orderStatus = this.orderInfo.status;
      console.log('ORDER INFO ====== ', this.orderInfo);
    }
    // populate load tags
    //  this.loadTagForm.setControl('tickets', this.setExistingLoadTags(this.orderInfo.loadTags));
  }

  // convenience getters for easy access to form fields
  get f() { return this.loadTagForm.controls; }
  get t() { return this.f.tickets as FormArray; }

  addLoadTag() {
    this.submitted = true;
    if (this.loadTagForm.value.tickets.length == 1) {
      return false;
    }
    this.t.push(this.formBuilder.group({
      quantityProduced: [null, [Validators.required]]
    }));
    console.log(this.loadTagForm.value.tickets);
  }

  insertNewLoadTag(index) {
  //  this.loadTagsToShow = [];
    console.log(this.loadTagForm.value.tickets[index]);
    const newLoadTag = {
      quantity: this.loadTagForm.value.tickets[0].quantityProduced,
      operator: this.tokenStorage.getUsername(),
      load_Date: moment().format() ,
    }
    console.log("Load Tag", newLoadTag);
  this.subscriptions.add(this.dataService.addAssemblyLoadTag(this.orderInfo.ordre.ordreid, newLoadTag).subscribe(res => {
      this.loadTagForm.reset();
      console.log('old loadtags => ',this.loadTagsToShow );
      console.log('loadTag added!', res);
      
    //  this.loadTagsToShow.push(res);
    this.orderInfo.ordre.produced = res['quantityProduced'];
    this.loadTagsToShow.push(res);

      this.packingSlipForm.patchValue({
        quantity: res['quantityProduced']
      });
/*
    this.subscriptions.add(this.dataService.getOrdersById(this.orderInfo.ordreid).subscribe(res1 => {
        console.log("update order info", res1);
       // this.orderInfo = res1;
        this.loadTagsToShow= res1['loadtags'];
      })
      );
      */
    //  console.log("load tag added", res);
      this.toastr.success('Load tag successfully added', 'Done!');
    })
    );
  }

  printLoadTag(index) {
    console.log(this.loadTagForm.value.tickets[index].quantityProduced);

    if (this.loadTagForm.value.tickets[index].quantityProduced > (this.orderInfo.ordre.quantityMax - this.orderInfo.ordre.produced)) {

      this.confirmationService.confirm({
        message: `The maximum quantity bypassed by :${this.loadTagForm.value.tickets[index].quantityProduced - (this.orderInfo.ordre.quantityMax - this.orderInfo.ordre.produced)}. Are you sure that you want to perform this action?`,
        accept: () => {
          this.insertNewLoadTag(index);
        }
      });
    } else {
      this.insertNewLoadTag(index);

    }

  }

  removeLoadTag(index) {
    this.t.removeAt(index);
    console.log(this.loadTagForm.value.tickets);
  }
  /*
    setExistingLoadTags(loadTags: LoadTag[]): FormArray {
      const formArray = new FormArray([]);
      loadTags.forEach(lt => {
        formArray.push(this.formBuilder.group({
          quantityProduced: [{value: lt.quantity, disabled: true}, [Validators.required]],
        }));
      });
  
      return formArray;
    }
    */


  completeShipping() {
    // remove loadTags
   // delete this.orderInfo.loadTags;
    // update quantity
    this.orderInfo.ordre.produced = this.packingSlipForm.value.quantity;
    console.log("set to complete");
    // remove part from order
    let orderClone = this.orderInfo;
    delete orderClone.part;
    delete orderClone.navigationId;
    console.log("order clone", this.orderInfo.ordre);
    
  this.subscriptions.add(this.dataService.setAssemblyToComplete(this.orderInfo.ordre.ordreid, this.packingSlipForm.value.quantity, this.orderInfo.ordre).subscribe(res => {
      console.log("set to complete response => ", res);
      this.toastr.success('Order updated successfully', 'Done!');
      //this.shippingIsComplete = true;
      this.router.navigate(['/order-delivery']);
    })
    );

  }

  onGenerateLabel() {

    let labelData = {
      title: this.orderInfo.part.title,
      author: this.orderInfo.part.author,
      poNumber: this.orderInfo.orderNum,
      printNumber: this.orderInfo.part.pnlNumber,
      isbn: this.orderInfo.part.isbn,
      weight: this.orderInfo.part.weight,
      totalQty: this.orderInfo.produced,
      perBoxQty: 10,
      date: this.orderInfo.dueDate
    };


    /*
    const labelData = {
      type: 'cover',
    }
    */
    this.router.navigate(['/label-generator'], { state: { labelData: labelData } });
  }

  onPrintLoadTag(index) {
    var printContents = document.getElementById("loadTag" + index).innerHTML;
    //var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    //  document.body.innerHTML = originalContents;

  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  generatePackingSlip(){
    window.scrollTo(0, 0);
    const options = {

      filename: `PackingSlip_${this.orderInfo.oldOrdreid}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, y:0 },
      jsPDF: { orientation: 'portrait', unit: 'cm', format: 'a4', compressPDF: true},
    };
    let packingSlipContent = this.packingSlip.nativeElement.innerHTML;
    console.log("packing slip", this.packingSlip);
    
    const worker = html2pdf().from(packingSlipContent).set(options).save()
    .then(done => {
    console.log('print done');

    });
    
  }

  dateFormatter(inputDate){ 
    var splitDate = inputDate.split('-');
    if(splitDate.count == 0){
        return null;
    }
  
    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2]; 
    
    return year + '-' + month + '-' + day;
  }

  chooseClass(){
    if(this.orderInfo.client.assemblyLabelPosition == 'top-left'){
      return 'label-top-left';
    }else if(this.orderInfo.client.assemblyLabelPosition == 'top-right'){
      return 'label-top-right';
    }else if(this.orderInfo.client.assemblyLabelPosition == 'bottom-left'){
      return 'label-bottom-left';
    }else if(this.orderInfo.client.assemblyLabelPosition == 'bottom-right'){
      return 'label-bottom-right';
    }else{
      return 'label-center';
    }
  }
}