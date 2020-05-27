import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-packing-slip-template',
  templateUrl: './packing-slip-template.component.html',
  styleUrls: ['./packing-slip-template.component.scss']
})
export class PackingSlipTemplateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @ViewChild('packingSlip', {static:false}) packingSlip: ElementRef;

  generatePackingSlip(){
    window.scrollTo(0, 0);
    const options = {

      filename: 'myfile.pdf',
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

}
