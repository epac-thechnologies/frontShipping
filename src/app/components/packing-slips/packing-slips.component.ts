import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-packing-slips',
  templateUrl: './packing-slips.component.html',
  styleUrls: ['./packing-slips.component.scss']
})
export class PackingSlipsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  @ViewChild('search', { static: false }) searchElement: ElementRef;
  searchForm: FormGroup;
  rowData = [];
  buttons: any[];
  selectedOrder: any = {};
  @ViewChild('packingSlip', {static:false}) packingSlip: ElementRef;

  columnDefs = [
    { field: 'oldOrdreid', header: 'Order ID' },
    { field: 'isbn', header: 'ISBN' },
    { field: 'quantity', header: 'Qty' },
    { field: 'produced', header: 'Qty produced' },
    { field: 'shipDate', header: 'Shipping Date' },
    { field: 'packing_slips_id', header: 'Packing S.' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) {
    this.selectedOrder = {
      "packing_slips_id": '',
      "shipDate": '',
      "notes": '',
      "ordreid":'',
      "pnlNumber": '',
      "status": '',
      "dueDate": '',
      "quantity": '',
      "produced": '',
      "oldOrdreid": '',
      "isbn": '',
      "title": '',
      "author": '',
      "numberOfBoxes": '',
      "qtyPerBox": '',
      "boxWeight": '',
      "palletWeight": '',
      "clientId": '',
      "shippingAdress": '',
      "billingAdress": '',
      "weight": '',
      "poNumber": '',
      "accountName": '',
      "accountManager": ''
    }
  }

  ngOnInit() {
    //
    this.searchForm = this.fb.group({
      search: new FormControl('', Validators.required),
      searchCriteria: new FormControl('', Validators.required)
    });

    this.buttons = [
      { icon: 'fa fa-file', color: 'success', func: this.onGeneratePS.bind(this) },
      { icon: 'fa fa-barcode', color: 'success', func: this.onGenerateLabels.bind(this) },
      { icon: 'fa fa-window-close', color: 'warning', func: this.onDelete.bind(this) },
    ];



    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 0);
  }

  onSearch() {
    console.log(this.searchForm.value);
  }

  onGeneratePS(row: any) {
    console.log("row",row);
    
   this.selectedOrder = row;
   console.log("selected order", this.selectedOrder);
   this.spinner.show()
  setTimeout(() => {
    this.generatePackingSlip();
    this.spinner.hide();
  }, 1000); 
  }

  onGenerateLabels(row: any) {
    let labelData = {
      title: row.title,
      author: row.author,
      poNumber: row.poNumber,
      printNumber: row.pnlNumber,
      isbn: row.isbn,
      weight: row.weight,
      totalQty: row.produced,
      perBoxQty: row.qtyPerBox,
      date: this.formatDate(row.dueDate)
    };

    this.router.navigate(['/label-generator'], { state: { labelData: labelData } });
  }

  onDelete(row: any) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to perform this action?`,
      accept: () => {
        this.subscriptions.add(this.dataService.cancelPackingSlip(row).subscribe(res => {
          this.rowData = [];
          this.toastr.success('Canceled successfully', 'done!');
        }));
      }
    });
  }

  searchForOrder() {
    this.rowData = [];
    this.subscriptions.add(
      this.dataService
        .getPsByCriteria(this.searchForm.value)
        .subscribe((res: any) => {
          this.searchForm.reset();
          console.log('RESULT', res);

          if(res.length == 0){
            this.toastr.warning('The order was not found', 'Sorry!');
            return;
          }else{
            res.forEach((element) => {
              let newOrder = {
                packing_slips_id: element['packing_slips_id'],
                shipDate: this.formatDate(element['shipDate']),
                notes: element['notes'],
                ordreid: element['ordreid'],
                pnlNumber: element['pnlNumber'],
                status: element['status'],
                dueDate: element['dueDate'],
                quantity: element['quantity'],
                produced: element['produced'],
                oldOrdreid: element['oldOrdreid'],
                isbn: element['isbn'],
                title: element['title'],
                author: element['author'],
                numberOfBoxes: element['numberOfBoxes'],
                qtyPerBox: element['qtyPerBox'],
                boxWeight: element['boxWeight'],
                palletWeight: element['palletWeight'],
                clientId: element['clientId'],
                shippingAdress: element['shippingAdress'],
                billingAdress: element['billingAdress'],
                weight: element['weight'],
                poNumber: element['poNumber'],
                accountName: element['accountName'],
                accountManager: element['accountManager']
              }
                this.rowData.push(newOrder);
            });
            this.toastr.success('Data imported successfully', 'Done!');
          }

        })
    );
  }

  generatePackingSlip(){
    window.scrollTo(0, 0);
    const options = {

      filename: `PackingSlip_${this.selectedOrder.packing_slips_id}.pdf`,
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

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
