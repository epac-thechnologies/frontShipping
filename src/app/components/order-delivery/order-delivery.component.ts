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
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.scss'],
})
export class OrderDeliveryComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  @ViewChild('search', { static: false }) searchElement: ElementRef;
  searchForm: FormGroup;
  rowData = [];
  buttons: any[];
  selectedOrder: any;

  columnDefs = [
    { field: 'oldOrdreid', header: 'Order ID' },
    { field: 'orderNum', header: 'Po#' },
    { field: 'part.isbn', header: 'ISBN' },
    { field: 'dueDate', header: 'Due date' },
    { field: 'quantity', header: 'Qty' },
    { field: 'quantityMin', header: 'Qty Min' },
    { field: 'quantityMax', header: 'Qty Max' },
    { field: 'produced', header: 'Qty produced' },
    { field: 'packagingType', header: 'packagingType' },
    { field: 'shippingstatus', header: 'Status' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    //
    this.searchForm = this.fb.group({
      search: new FormControl('', Validators.required),
      //  'searchCriteria': new FormControl('', Validators.required)
    });

    this.buttons = [
      { icon: 'fa fa-send', color: 'success', func: this.onShip.bind(this) },
    ];

    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.searchElement.nativeElement.focus();
    }, 0);
  }

  onSearch() {
    console.log(this.searchForm.value);
  }

  onShip(row: any) {
    // remove isbn before send
    delete row.isbn;
    let order = {
      assemblystatus: row['assemblystatus'],
      client: row['client'],
      dueDate: row['dueDate'],
      loadTags: row['loadtags'],
      oldOrdreid: row['oldOrdreid'],
      orderNum: row['orderNum'],
      ordreid: row['orderId'],
      packagingType: row['packagingType'],
      part: row['part'],
      produced: row['produced'],
      quantity: row['quantity'],
      quantityMax: row['quantityMax'],
      quantityMin: row['quantityMin'],
      shippingstatus: row['shippingstatus'],
    };
    console.log('shipped row', order);
    console.log('order ID', row.orderId);
    this.subscriptions.add(
      this.dataService.updateOrder(row.orderId, order).subscribe((res) => {
        console.log('updatedddd versionn', res);
        this.selectedOrder = res;
        this.selectedOrder['dueDate']= this.formatDate(this.selectedOrder['dueDate']);
        console.log('selected orderrrrrr', this.selectedOrder);
        this.router.navigateByUrl('/shipping', { state: this.selectedOrder });
      })
    );
  }

  searchForOrder() {
    this.rowData = [];
    this.subscriptions.add(
      this.dataService
        .getOrdersByIsbn(this.searchForm.value.search)
        .subscribe((res: any) => {
          this.searchForm.reset();
          console.log('RESULT', res);
          if(res.length == 0){
            this.toastr.warning('The order was not found', 'Sorry!')
          }else{
          res.forEach((element) => {
            const order = {
              orderId: element['ordreid'],
              orderNum: element['orderNum'],
              shippingstatus: element['shippingstatus'],
              assemblystatus: element['assemblystatus'],
              dueDate: this.formatDate(element['dueDate']),
              quantity: element['quantity'],
              quantityMax: element['quantityMax'],
              quantityMin: element['quantityMin'],
              produced: element['produced'],
              packagingType: element['packagingType'],
              oldOrdreid: element['oldOrdreid'],
              part: element['part'],
              loadTags: element['loadTags'],
              client: element['client'],
            };
            this.rowData.push(order);
          });
          this.toastr.success('Order imported successfully', 'Done!');
        }//else

        })
    );
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
