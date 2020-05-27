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
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  orderInfo: any = [];
  packingSlipInfo:any = {
      packing_slips_id: null,
      ordreid: null,
      shipDate: null,
      notes: null,
      produced: null,
      url_packing_slips: null

  };
  numberOfBoxes = 0;
  boxWeight= 0;
  palletWeight= 0;

  loadTagsToShow:any[] | null;
  partInfo: Promise<any> | null;

  loadTagForm: FormGroup;
  submitted = false;
  orderStatus: any;
  shippingIsComplete = false;

  packingSlipForm = new FormGroup({
    shipDate: new FormControl(null, [Validators.required]),
    quantity:new FormControl(null, [Validators.required]),
    notes: new FormControl(null),
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
        this.router.navigate(['/order-delivery']);
    } else {
      console.log("M3ebi", this.orderInfo);
      this.loadTagsToShow = this.orderInfo.loadtags;
      this.packingSlipForm = new FormGroup({
        shipDate: new FormControl(new Date(), [Validators.required]),
        quantity:new FormControl(this.orderInfo.produced, [Validators.required]),
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
      load_Date: moment().format() ,
      operator: this.tokenStorage.getUsername()
    }
    console.log("load tag", newLoadTag);
  this.subscriptions.add(this.dataService.addLoadTag(this.orderInfo.ordreid, newLoadTag).subscribe(res => {
      this.loadTagForm.reset();
      console.log('old loadtags => ',this.loadTagsToShow );
      console.log('loadTag added!', res);
      
    //  this.loadTagsToShow.push(res);
    this.orderInfo.produced = res['quantityProduced'];
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

    if (this.loadTagForm.value.tickets[index].quantityProduced > (this.orderInfo.quantityMax - this.orderInfo.produced)) {

      this.confirmationService.confirm({
        message: `The maximum quantity bypassed by :${this.loadTagForm.value.tickets[index].quantityProduced - (this.orderInfo.quantityMax - this.orderInfo.produced)}. Are you sure that you want to perform this action?`,
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
    delete this.orderInfo.loadTags;
    // update quantity
    this.orderInfo.produced = this.packingSlipForm.value.quantity;
    console.log("set to complete");

    // create packing slip data and save it
    let newPackingSlip = {
      ordreid: this.orderInfo.ordreid,
      shippingAdress: this.orderInfo.client.adressShipping,
      billingAdress: this.orderInfo.client.adressBilling,
      accountName: this.orderInfo.client.accountName,
      accountManager: this.orderInfo.client.accountManager,
      shipDate: this.packingSlipForm.value.shipDate,
      clientId: this.orderInfo.client.clientId,
      dueDate: this.orderInfo.dueDate,
      isbn: this.orderInfo.part.isbn,
      title: this.orderInfo.part.title,
      author: this.orderInfo.part.author,
      poNumber: this.orderInfo.orderNum,
      quantity: this.orderInfo.quantity,
      produced: this.packingSlipForm.value.quantity,
      numberOfBoxes: this.numberOfBoxes,
      boxWeight: this.orderInfo.part.weight * this.orderInfo.part.bestbox.qtyperbox / 1000,
      palletWeight: (this.orderInfo.part.weight * this.orderInfo.part.bestbox.qtyperbox / 1000)* this.numberOfBoxes,
      notes: this.packingSlipForm.value.notes,
      qtyPerBox: this.orderInfo.part.bestbox.qtyperbox,
      weight: this.orderInfo.part.weight,
      pnlNumber: this.orderInfo.part.pnlNumber,
      oldOrdreid: this.orderInfo.oldOrdreid,
      status: 'DELIVRED',
      price: this.orderInfo.part.price


    }

    console.log("packing slip", newPackingSlip);
    /*
    this.dataService.savePackingSlip(newPackingSlip).subscribe((res)=> {
      console.log('packing slip saved => ', res );
      this.packingSlipInfo = res;
      this.toastr.success('Packing slip saved successfully!', 'Done!');
    });
    */
    
  this.subscriptions.add(this.dataService.setStatusToComplete(this.orderInfo.ordreid, newPackingSlip).subscribe(res => {
      console.log("set to complete response => ", res);
      this.toastr.success('Order Updated successfully', 'Done!');
      this.packingSlipInfo = res;
      this.shippingIsComplete = true;
     // this.router.navigate(['/order-delivery']);
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
      perBoxQty: this.orderInfo.part.bestbox.qtyperbox,
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

      filename: `PackingSlip_${this.packingSlipInfo.packing_slips_id}.pdf`,
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

  getTotalWeight(){
    let weight = this.orderInfo.part.weight * this.orderInfo.produced / 1000;
    return weight;
  }
  getNumberOfBoxes(){
    let numberOfBoxes = this.orderInfo.produced / this.orderInfo.part.bestbox.qtyperbox;
    if(this.isFloat(numberOfBoxes)){
      numberOfBoxes = Math.floor(numberOfBoxes)+1;
      this.numberOfBoxes = numberOfBoxes;
      return numberOfBoxes;
    }
  }

  isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
}