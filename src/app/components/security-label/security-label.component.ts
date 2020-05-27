import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security-label',
  templateUrl: './security-label.component.html',
  styleUrls: ['./security-label.component.scss'],
})
export class SecurityLabelComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  columnDefs = [
    { field: 'ordre.ordreid', header: 'Order ID' },
    { field: 'ordre.orderNum', header: 'Po#' },
    { field: 'part.isbn', header: 'ISBN' },
    { field: 'ordre.dueDate', header: 'Due date' },
    { field: 'ordre.quantity', header: 'Qty' },
    { field: 'ordre.quantityMin', header: 'Qty Min' },
    { field: 'ordre.quantityMax', header: 'Qty Max' },
    { field: 'ordre.produced', header: 'Qty produced' },
    { field: 'ordre.packagingType', header: 'packagingType' },
    { field: 'ordre.assemblystatus', header: 'Status' },
  ];
  rowData: any[] = [];
  buttons: any[];
  selectedOrder: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.getAssemblyOrders();
  }

  ngOnInit() {
    this.buttons = [
      {
        icon: 'fa fa-lock',
        color: 'success',
        func: this.onShipToAssembly.bind(this),
      },
    ];
  }

  onShipToAssembly(row: any) {
    console.log('shipped row', row);
    console.log('order ID', row['ordre'].ordreid);

    this.subscriptions.add(
      this.dataService
        .updateAssemblyOrder(row['ordre'].ordreid, row)
        .subscribe((res) => {
          console.log('updatedddd versionn', res);
          this.selectedOrder = res;
          /*
          this.selectedOrder['dueDate'] = this.formatDate(
            this.selectedOrder['dueDate']
          );
          */

          //  console.log('selected orderrrrrr', this.selectedOrder);
          this.router.navigateByUrl('/assembly', { state: this.selectedOrder });
        })
    );
  }

  getAssemblyOrders() {
    this.dataService.getAssemblyOrders().subscribe((res: any[]) => {
      console.log('assmebly orders => ', res);

      res.forEach((element) => {
        let neworder = {
          ordre: {
            ordreid: element.ordre['ordreid'],
            orderNum: element.ordre['orderNum'],
            shippingstatus: element.ordre['shippingstatus'],
            assemblystatus: element.ordre['assemblystatus'],
            dueDate: this.formatDate(element.ordre['dueDate']),
            quantity: element.ordre['quantity'],
            quantityMax: element.ordre['quantityMax'],
            quantityMin: element.ordre['quantityMin'],
            produced: element.ordre['produced'],
            clientId: element.ordre['clientId'],
            packagingType: element.ordre['packagingType'],
            oldOrdreid: element.ordre['oldOrdreid'],
            partId: element.ordre['partId'],
            isbn: element.ordre['isbn'],
            loadtags: element.ordre['loadtags'],
          },
          part: {
            partId: element.part['partId'],
            isbn: element.part['isbn'],
            title: element.part['title'],
            author: element.part['author'],
            boxId: element.part['boxId'],
            bookByBox: element.part['bookByBox'],
            price: element.part['price'],
            pnlNumber: element.part['pnlNumber'],
            length: element.part['length'],
            width: element.part['width'],
            weight: element.part['weight'],
            bookSpine: element.part['bookSpine'],
          },
          client: {
            accountManager: element.client['accountManager'],
            accountName: element.client['accountName'],
            adressBilling: element.client['adressBilling'],
            adressShipping: element.client['adressShipping'],
            assemblyLabelPosition: element.client['assemblyLabelPosition'],
            clientId: element.client['clientId'],
            packagingTypesId: element.client['packagingTypesId'],
            packagingtypes: element.client['packagingtypes'],
          },
        };
        this.rowData.push(neworder);
      });
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
