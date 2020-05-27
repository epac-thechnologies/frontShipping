import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api/';

interface Packaging {
  label: string,
  value: string
}

@Component({
  selector: 'app-clients-administration',
  templateUrl: './clients-administration.component.html',
  styleUrls: ['./clients-administration.component.scss']
})
export class ClientsAdministrationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  clientForm: FormGroup;
  packagingTypesOptions = [];
  selectedPackages: Packaging[];
  labelPositionOptions = [
    {label:'top-left', value:'top-left'},
    {label:'top-right', value:'top-right'},
    {label:'bottom-left', value:'bottom-left'},
    {label:'bottom-right', value:'bottom-right'},
    {label:'center', value:'center'},
  ]

  rowData = [];
  rowDataClone = [];
  columnDefs = [
    { field: 'clientId', header: 'ID#' },
    { field: 'accountName', header: 'Account Name' },
    { field: 'accountManager', header: 'Account Manager' },
    { field: 'adressShipping', header: 'Shipping Adress' },
    { field: 'adressBilling', header: 'Billing Adress' },
    { field: 'packagingtypes', header: 'Packaging Types' },
    {field: 'assemblyLabelPosition', header: 'Label Position'}
  ];

  buttons: any[];
  // packagingTypes: SelectItem[];
  mode = " ";

  constructor(private fb: FormBuilder, private dataService: DataService, private toastr: ToastrService, private confirmationService: ConfirmationService) {

    this.getPackagesOptions();

  }

  ngOnInit() {
    this.buttons = [
      { icon: 'fa fa-edit', color: "secondary", dataToggle: "modal", dataTarget: "#editModal", func: this.onEdit.bind(this) },
      { icon: 'fa fa-trash', color: "danger", func: this.onDelete.bind(this) },
    ];

    this.clientForm = this.fb.group({
      'id': new FormControl(null, Validators.required),
      'accountName': new FormControl(null, Validators.required),
      'accountManager': new FormControl(null, Validators.required),
      'shippingAdress': new FormControl(null, Validators.required),
      'billingAdress': new FormControl(null, Validators.required),
      'packagingTypes': new FormControl(null, Validators.required),
      'assemblyLabelPosition': new FormControl(null, Validators.required),
    });
    this.getAllClients();
  }

  onAddTrigger() {
    this.clientForm.reset();
    this.mode = "Add";
  }

  onEdit(row: any) {
    this.clientForm.patchValue({
      id: row.clientId,
      accountName: row.accountName,
      accountManager: row.accountManager,
      shippingAdress: row.adressShipping,
      billingAdress: row.adressBilling,
      packagingTypes: row.packagingtypes,
      assemblyLabelPosition: row.assemblyLabelPosition
    });
    console.log("types", this.clientForm.value.packagingTypes);

    this.mode = "Edit";
    console.log("edit mode", row, this.clientForm.value);
  }

  onAdd(row: any) {
    this.mode = "Add";
    console.log("add mode", row);
  }

  onDelete(row: any) {
    this.mode = "Delete";
    console.log("delete mode - client", row);

    this.confirmationService.confirm({
      message: `Are you sure that you want to perform this action?`,
      accept: () => {
        this.subscriptions.add(
          this.dataService.deleteClient(row.clientId).subscribe((res)=>{
            console.log("client delete result => ", res);
            if(res == null){
              this.toastr.warning(`Client "${row.clientId}" can't be deleted!`);
            }else{
              this.toastr.success('Client deleted successfully!');
              this.getAllClients();
            }

          })
        );
      }
    });
  }

  onUpdateClient() {
  //  console.log(this.clientForm.value);
    let newClient = {
      clientId: this.clientForm.value.id,
      packagingTypesId: [...this.clientForm.value.packagingTypes],
      accountName: this.clientForm.value.accountName,
      accountManager: this.clientForm.value.accountManager,
      adressShipping: this.clientForm.value.shippingAdress,
      adressBilling: this.clientForm.value.billingAdress,
      assemblyLabelPosition: this.clientForm.value.assemblyLabelPosition
    }
    console.log("update client ", newClient);
    this.subscriptions.add(
      this.dataService.addNewClient(newClient).subscribe((res) => {
        console.log('update client result  ', res);
        //  this.rowData.push(res);
        this.toastr.success(`Client '${this.clientForm.value.id}' updated successfully!`, 'Yupi!');
        this.getAllClients();
      })
    );

  }

  onAddClient() {
    let newClient = {
      clientId: this.clientForm.value.id,
      packagingTypesId: [...this.clientForm.value.packagingTypes],
      accountName: this.clientForm.value.accountName,
      accountManager: this.clientForm.value.accountManager,
      adressShipping: this.clientForm.value.shippingAdress,
      adressBilling: this.clientForm.value.billingAdress,
      assemblyLabelPosition: this.clientForm.value.assemblyLabelPosition
    }
    console.log("add new client ", newClient);
    this.subscriptions.add(
      this.dataService.updateClient(newClient).subscribe((res) => {
        console.log('add new client result  ', res);
        //  this.rowData.push(res);
        this.toastr.success(`Client '${this.clientForm.value.id}' Added successfully!`, 'Yupi!');
        this.getAllClients();
      })
    );
  }

  deleteClient(row: any) {

  }

  getPackagesOptions() {
    this.packagingTypesOptions = [];
    this.subscriptions.add(this.dataService.getAllPackages().subscribe((res: []) => {
      //  console.log("all packages", res);
      res.map(pack => {
        this.packagingTypesOptions.push({ label: pack['packagingtypeid'], value: pack['packagingtypeid'] })
      });
      console.log("pack types", this.packagingTypesOptions);
    }));
  }

  getAllClients() {
    this.rowData = [];
    this.subscriptions.add(
      this.dataService.getAllClients().subscribe((res: []) => {
         console.log("clients result", res);

        res.map((c: any) => {
          if(c['packagingtypes'].length>0){
            this.rowDataClone = [];
            c['packagingtypes'].map(pack => {
              this.rowDataClone.push(pack['packagingtypeid'])
            });
          }else{
            this.rowDataClone = [];
          }
          let client = {
            clientId: c.clientId,
            accountName: c.accountName,
            accountManager: c.accountManager,
            adressBilling: c.adressBilling,
            adressShipping: c.adressShipping,
            packagingtypes: this.rowDataClone,
            assemblyLabelPosition: c.assemblyLabelPosition
          }
          this.rowData.push(client);
        });// map
      //  console.log("all clients => ", this.rowData);
        //  this.rowData = res;

      })
    );
  }




  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
