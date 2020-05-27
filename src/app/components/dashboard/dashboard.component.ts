import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  state:any;

  numberOfBoxes: number;
  restQty:number;
  tickets=[];
  demoTickets = [];
  downloadIsReady= false;
  dueDate:any;

  ticketForm = new FormGroup({
    title: new FormControl('Exemple title'),
    author: new FormControl('Exemple author'),
//    publisher: new FormControl('publisher'),
    poNumber: new FormControl(10),
    printNumber: new FormControl(12),
    isbn: new FormControl(9781432868888),
    weight: new FormControl(32),
    totalQty: new FormControl(999),
    perBoxQty: new FormControl(24),
    date: new FormControl('2019-10-20')
  });

  @ViewChild('ticketContent', {static:false}) ticketContent: ElementRef;

  constructor(private spinner: NgxSpinnerService, private location: Location) { }

  ngOnInit() {
    /*
    this.state = this.location.getState();
      console.log('sent state ', this.state);
      */
     console.log(history.state.labelData);
     
     if (history.state.labelData === null || history.state.labelData === undefined) {
console.log("empty");
     }else{
console.log("state data",history.state.labelData);
this.ticketForm = new FormGroup({
  title: new FormControl(history.state.labelData['title']),
  author: new FormControl(history.state.labelData['author']),
//    publisher: new FormControl('publisher'),
  poNumber: new FormControl(history.state.labelData['poNumber']),
  printNumber: new FormControl(history.state.labelData['printNumber']),
  isbn: new FormControl(history.state.labelData['isbn']),
  weight: new FormControl(history.state.labelData['weight']),
  totalQty: new FormControl(history.state.labelData['totalQty']),
  perBoxQty: new FormControl(history.state.labelData['perBoxQty']),
  date: new FormControl(history.state.labelData['date'])
});

     }
  
  }

  onGeneratePdf() {
    console.warn(this.ticketForm.value);
    this.dueDate = this.dateFormatter(this.ticketForm.value.date);
console.log('new date', this.dueDate);

// calculate
    this.numberOfBoxes = this.ticketForm.value.totalQty / this.ticketForm.value.perBoxQty;
    this.restQty = this.ticketForm.value.totalQty % this.ticketForm.value.perBoxQty;

    if(this.isFloat(this.numberOfBoxes)){
      console.log("is float + 1", this.numberOfBoxes);
      this.numberOfBoxes = Math.floor(this.numberOfBoxes)+1;
      console.log(this.numberOfBoxes);
    }

    for (let i = 1; i <= this.numberOfBoxes; i++) {

        if(this.restQty === 0){
          let element = {
            index : i,
            qtyPerBox : this.ticketForm.value.perBoxQty,
          }
          console.log(i + '-' + this.numberOfBoxes);
          
          this.tickets.push(element);
        }else{
          if(this.numberOfBoxes > i){
            let element = {
              index : i,
              qtyPerBox : this.ticketForm.value.perBoxQty,
            }
            console.log(i + '-' + this.numberOfBoxes);
            this.tickets.push(element);
          }
          if(this.numberOfBoxes == i){
            let element = {
              index : i,
              qtyPerBox : this.restQty,
            }
            console.log(i + '-' + this.numberOfBoxes);
            this.tickets.push(element);
          }


        }

console.log(this.tickets);
      
    }

console.log("number of boxes", this.numberOfBoxes);
console.log("qty for last box", this.restQty);
let labelData = {
  index : '--',
  qtyPerBox : this.tickets[0].qtyPerBox
}
this.demoTickets.push(labelData);
let lastEl = this.tickets.length-1;
console.log("last el ", this.tickets[lastEl]);

this.demoTickets.push(this.tickets[lastEl]);
console.log("demo",this.demoTickets);


this.downloadIsReady = true;

  }

  onDownloadPdf(){
    window.scrollTo(0, 0);
    this.spinner.show();
    const options = {
      margin:       0,
      filename: 'Label.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2},
      jsPDF: { orientation: 'landscape', unit: 'in', format: 'a6', compressPDF: true},
    };
    let content2 = this.ticketContent.nativeElement.innerHTML;
    const worker = html2pdf().from(content2).set(options).save()
    .then(done => {
    console.log('print done');
    this.spinner.hide();
    });
    
  }


  onReset(){
    this.downloadIsReady = false;
    this.ticketForm.reset();
    this.tickets = [];
  }

  isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}



dateFormatter(inputDate){ 
  var splitDate = inputDate.split('-');
  if(splitDate.count == 0){
      return null;
  }

  var year = splitDate[0];
  var month = splitDate[1];
  var day = splitDate[2]; 

  return month + '/' + day + '/' + year;
}




}