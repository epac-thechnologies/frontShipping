import { Component, OnInit, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit {
  @Input() columnDefs;
  @Input() rowData;
  @Input() buttons;

  selectedData;

  constructor(private storageService: LocalStorageService) {}

  ngOnInit() {}

  executeFunc(func: Function, rowData: any) {
    func(rowData);
  }


}
