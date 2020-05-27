import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-load-tag',
  templateUrl: './load-tag.component.html',
  styleUrls: ['./load-tag.component.scss']
})
export class LoadTagComponent implements OnInit {
  @ViewChild('loadTag', {static:false}) loadTag: ElementRef;
  @Input() tag: any;
  constructor() { }

  ngOnInit() {
  }



  downloadLoadTag(){
    /*
    const options = {

      filename: 'loadTag.pdf',
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { orientation: 'portrait', unit: 'cm', format: 'a4', compressPDF: true},
    };
    let loadTagContent = this.loadTag.nativeElement.innerHTML;
    console.log("Load tag", this.loadTag);
    
    const worker = html2pdf().from(loadTagContent).set(options).save()
    .then(done => {
    console.log('print done');

    });
    */

    var printContents = document.getElementById("loadTag").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

  }

}
