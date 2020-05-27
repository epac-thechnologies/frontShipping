import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api/';

@Component({
  selector: 'app-packaging-administration',
  templateUrl: './packaging-administration.component.html',
  styleUrls: ['./packaging-administration.component.scss']
})
export class PackagingAdministrationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  //package
  rowData = [];
  packageForm: FormGroup;
  activeOptions: any;
  selectedPackages: any;
  selectedPackInfo: any;
  //box
  rowData2 = [];
  boxForm: FormGroup;
  selectedBoxInfo: any;
  packagingTypesOptions: any[] = [];

  /*
  rowData = [
    {
      id: 'Pack1',
      packageName: 'Container',
      active: 'true',
    },
    {
      id: 'Pack2',
      packageName: 'PCB',
      active: 'false',
    }
  ];

  rowData2 = [
    {
      id: 'Box1',
      weight: 13,
      nombreExistant: 358,
      longueur: 10.3,
      largeur: 7,
      profondeur: 15,
      packagingtypeid: 'container',
      active: 'true'
    },
    {
      id: 'Box2',
      weight: 23,
      nombreExistant: 558,
      longueur: 2.3,
      largeur: 17,
      profondeur: 25,
      packagingtypeid: 'pcb',
      active: 'false'
    },
    {
      id: 'Box3',
      weight: 33,
      nombreExistant: 458,
      longueur: 30.3,
      largeur: 15,
      profondeur: 10,
      packagingtypeid: 'pack3',
      active: 'false'
    },
    {
      id: 'Box4',
      weight: 30,
      nombreExistant: 758,
      longueur: 80,
      largeur: 40,
      profondeur: 29,
      packagingtypeid: 'pack4',
      active: 'true'
    },
  ];
*/
  columnDefs = [
    { field: 'packagingtypeid', header: 'ID#' },
    { field: 'packageName', header: 'Package Name' },
    { field: 'active', header: 'Active' },
  ];

  columnDefs2 = [
    { field: 'boxNum', header: 'ID#' },
    { field: 'weight', header: 'Weight' },
    { field: 'nombreExistant', header: 'Qty' },
    { field: 'longueur', header: 'Length' },
    { field: 'largeur', header: 'Width' },
    { field: 'profondeur', header: 'depth' },
    { field: 'packagingTypesId', header: 'Packages' },
    { field: 'active', header: 'Active' },
  ];
  buttons: any[];
  buttons2: any[];
  // packagingTypes: SelectItem[];
  mode = " ";
  mode2 = " ";

  constructor(private fb: FormBuilder, private dataService: DataService, private toastr: ToastrService,private confirmationService: ConfirmationService) {
    this.getPackages();
    this.getBoxes();

    this.activeOptions = [
      { label: 'Active', value: true },
      { label: 'Inactive', value: false },
    ];


  }

  ngOnInit() {
    this.buttons = [
      { icon: 'fa fa-info', color: "success", dataToggle: "modal", dataTarget: "#viewModal", func: this.onView.bind(this) },
      { icon: 'fa fa-edit', color: "secondary", dataToggle: "modal", dataTarget: "#editModal", func: this.onEdit.bind(this) },
      { icon: 'fa fa-trash', color: "danger", func: this.onDelete.bind(this) },
    ];
    this.buttons2 = [
      //  { icon: 'fa fa-info', color: "success", dataToggle: "modal", dataTarget: "#viewModal2", func: this.onView2.bind(this) },
      { icon: 'fa fa-edit', color: "secondary", dataToggle: "modal", dataTarget: "#editModal2", func: this.onEdit2.bind(this) },
      { icon: 'fa fa-trash', color: "danger", func: this.onDelete2.bind(this) },
    ];
    this.packageForm = this.fb.group({
      'id': new FormControl(null, Validators.required),
      'packageName': new FormControl(null, Validators.required),
      'active': new FormControl(null, Validators.required),
    });
    this.boxForm = this.fb.group({
      'id': new FormControl(null, Validators.required),
      'weight': new FormControl(null, Validators.required),
      'existantNumber': new FormControl(null, Validators.required),
      'packagingTypes': new FormControl(null, Validators.required),
      'length': new FormControl(null, Validators.required),
      'width': new FormControl(null, Validators.required),
      'depth': new FormControl(null, Validators.required),
      'active': new FormControl(null, Validators.required),
    });



  }
  onAddTrigger() {
    this.packageForm.reset();
    this.mode = "Add";
  }
  onAddTrigger2() {
    this.boxForm.reset();
    this.mode2 = "Add";
  }

  onEdit(row: any) {
    this.packageForm.patchValue({
      id: row.packagingtypeid,
      packageName: row.packageName,
      active: row.active
    });
    this.mode = "Edit";
    console.log("edit mode", row, this.packageForm.value);
  }
  onEdit2(row: any) {
    this.boxForm.patchValue({
      id: row.boxNum,
      weight: row.weight,
      existantNumber: row.nombreExistant,
      packagingTypes: row.packagingTypesId,
      length: row.longueur,
      width: row.largeur,
      depth: row.profondeur,
      active: row.active
    });
    this.mode2 = "Edit";
    console.log("edit mode", row, this.boxForm.value);
  }

  onView(row: any) {
    this.selectedPackInfo = row;
    console.log("view mode", row);
  }
  /*
  onView2(row: any) {
    this.selectedBoxInfo = row;
    console.log("view mode - box", row);
  }
  */


  onAdd(row: any) {
    this.mode = "Add";
    // console.log("add mode", row);
  }
  onAdd2(row: any) {
    this.mode2 = "Add";
    // console.log("add mode", row);
  }

  onDelete(row: any) {
    this.mode = "Delete";
    console.log("delete mode", row);
      
      this.confirmationService.confirm({
        message: `Are you sure that you want to perform this action?`,
        accept: () => {
          this.subscriptions.add(
            this.dataService.deletePackage(row.packagingtypeid).subscribe((res)=>{
              this.toastr.success('Package deleted successfully!');
              this.getPackages();
            })
          );
          
        }
      });
    
  }
  onDelete2(row: any) {
    this.mode2 = "Delete";
    console.log("delete mode - box", row);

    this.confirmationService.confirm({
      message: `Are you sure that you want to perform this action?`,
      accept: () => {
        this.subscriptions.add(
          this.dataService.deleteBox(row.boxNum).subscribe((res)=>{
            this.toastr.success('Box deleted successfully!');
            this.getBoxes();
          })
        );
        
      }
    });
  }

  onUpdatePackage() {
    console.log(this.packageForm.value);
    const newPack = {
      packagingtypeid: this.packageForm.value.id,
      packageName: this.packageForm.value.packageName,
      active: this.packageForm.value.active
    }
    //console.log(newPack);
    
    this.subscriptions.add(this.dataService.updatePackage(newPack).subscribe((res) => {
      console.log('Package update result ', res);
    //  this.rowData.push(res);
    this.toastr.success(`Package '${this.packageForm.value.id}' updated successfully!`, 'Yupi!');
    this.getPackages();

    }));
    
  }
  onUpdateBox() {
  //  console.log(this.boxForm.value);
    const newBox = {
      boxNum: this.boxForm.value.id,
      weight: this.boxForm.value.weight,
      nombreExistant: this.boxForm.value.existantNumber,
      packagingTypesId: this.boxForm.value.packagingTypes,
      active: this.boxForm.value.active,
      longueur: this.boxForm.value.length,
      largeur: this.boxForm.value.width,
      profondeur: this.boxForm.value.depth
    }
    console.log(newBox);
    
    this.subscriptions.add(this.dataService.updateBox(newBox).subscribe((res) => {
      console.log('Box update result ', res);
    //  this.rowData.push(res);
    this.toastr.success(`Box '${this.boxForm.value.id}' updated successfully!`, 'Yupi!');
    this.getBoxes();

    }));
  }

  onAddPackage() {
    console.log(this.packageForm.value);
    const newPack = {
      packagingtypeid: this.packageForm.value.id,
      packageName: this.packageForm.value.packageName,
      active: this.packageForm.value.active
    }
    this.subscriptions.add(this.dataService.addNewPackage(newPack).subscribe((res) => {
      console.log('add new package ', res);
      this.rowData.push(res);
      this.toastr.success(`Package '${this.packageForm.value.id}' added successfully!`, 'Yupi!');
    }));
  }

  onAddBox() {
    // console.log(this.boxForm.value);
    const newBox = {
      boxNum: this.boxForm.value.id,
      weight: this.boxForm.value.weight,
      nombreExistant: this.boxForm.value.existantNumber,
      packagingTypesId: this.boxForm.value.packagingTypes,
      active: this.boxForm.value.active,
      longueur: this.boxForm.value.length,
      largeur: this.boxForm.value.width,
      profondeur: this.boxForm.value.depth
    }
    console.log(newBox);


    this.subscriptions.add(this.dataService.addNewBox(newBox).subscribe((res) => {
      console.log('add new Box ', res);
      this.rowData2.push(res);
      this.toastr.success(`Box '${this.boxForm.value.id}' added successfully!`, 'Yupi!');
    }));

  }

  getPackages() {
    this.rowData=[];
    this.packagingTypesOptions=[];
    this.subscriptions.add(this.dataService.getAllPackages().subscribe((res: []) => {
      console.log("all packages", res);
      this.rowData = res;
      res.map(pack => {
        this.packagingTypesOptions.push({ label: pack['packagingtypeid'], value: pack['packagingtypeid'] })
      });
      console.log("pack types", this.packagingTypesOptions);
    }));
  }

  getBoxes() {
    this.rowData2= [];
    this.subscriptions.add(this.dataService.getAllBoxes().subscribe((res: []) => {
      console.log('all boxes', res);
      this.rowData2 = res;
      /*
      console.log("all boxes", res['_embedded'].boxes);
      this.rowData2 = res['_embedded'].boxes;
      */
    }));
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
