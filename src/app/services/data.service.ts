import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigurationService } from './configuration.service';
import { TokenStorage } from './authentification/token-storage.service';
import { Observable } from 'rxjs';
import { HttpCallsService } from './http-calls.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  httpOptions = {
    headers: new HttpHeaders(),
  };

  private eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  private shippingService = 'http://192.168.75.215:7777/SHIPPING-SERVICE';
  private assemblyService = 'http://192.168.75.215:7777/ASSEMBLYSTATION';
  private orderSerivce = 'http://192.168.75.215:7777/CLIENT-SERVICE';
  private archiveService = 'http://192.168.75.215:7777/ARCHIVE-BILLING-SERVICE';

  constructor(
    private http: HttpClient,
    private cfg: ConfigurationService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private httpClient: HttpCallsService
  ) {
    this.httpOptions.headers = this.getHeaders();
  }

  public getEventObservable() {
    return this.eventEmitter.asObservable();
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorage.getAccessToken();
    console.log(token);

    let headers = new HttpHeaders({
      Authorization: 'Bearer' + ' ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    return headers;
  }

  // shipping
  getOrdersByIsbn(isbn) {
    return this.http.get(this.shippingService + `/ordresByIsbn/${isbn}`);
  }

  getOrdersById(id) {
    return this.http.get(this.shippingService + `/ordres/${id}`);
  }

  updateOrder(id, order) {
    console.log('order status update', order);
    return this.http.post(this.shippingService + `/ordres/${id}`, order);
  }

  addLoadTag(orderId, loadTag) {
    console.log('order id => ', orderId);
    return this.http.post(
      this.shippingService + `/loadTagsbyorder/${orderId}`,
      loadTag
    );
  }

  setStatusToComplete(id, order) {
    return this.http.post(
      this.shippingService + `/ordres/complete/${id}`, order 
    );
  }

  savePackingSlip(packingSlip){
    return this.http.post(this.shippingService + `/shipping`, packingSlip);
  }

  //$$$$$$$$$$$$$ packing Slip$$$$$$$$$$$$$$$//
  getPsByCriteria(searchForm) {
    if(searchForm.searchCriteria == 'isbn'){
      return this.http.get(this.archiveService + `/ordresByIsbn/${searchForm.search}`);
    }else{
      return this.http.get(this.archiveService + `/ordresByOldOrdreId/${searchForm.search}`);
    }
  }

  cancelPackingSlip(order){
    return this.http.post(this.archiveService + `/annulerordres`, order);
  }

  /*==============Packaging=================*/
  /*========================================*/
  getAllPackages() {
    return this.http.get(this.orderSerivce + `/packagingtypes`);
  }

  addNewPackage(packaging) {
    return this.http.post(this.orderSerivce + `/packagingtypes`, packaging);
  }

  updatePackage(pack) {
    console.log('pack updated!', pack);
    return this.http.post(this.orderSerivce + `/packagingtypes`, pack);
  }

  deletePackage(id) {
    return this.http.delete(this.orderSerivce + `/deletePackage/${id}`);
  }
  /*==============Boxes=================*/
  /*====================================*/
  getAllBoxes() {
    return this.http.get(this.orderSerivce + `/boxes`);
  }

  addNewBox(box) {
    return this.http.post(this.orderSerivce + `/addbox`, box);
  }

  updateBox(box) {
    console.log('Box updated!', box);
    return this.http.post(this.orderSerivce + `/updatebox`, box);
  }

  deleteBox(id) {
    return this.http.get(this.orderSerivce + `/deleteBoxe/${id}`);
  }

  /*==============Client=================*/
  /*=====================================*/
  getAllClients() {
    return this.http.get(this.orderSerivce + `/clients`);
  }

  addNewClient(client) {
    return this.http.post(this.orderSerivce + `/client`, client);
  }

  updateClient(client) {
    console.log('Client updated!', client);
    return this.http.post(this.orderSerivce + `/client`, client);
  }

  deleteClient(id) {
    return this.http.get(this.orderSerivce + `/deleteClient/${id}`);
  }

  /*================= Assembly station =======================*/
  /*==========================================================*/

  getAssemblyOrders() {
    return this.http.get(this.assemblyService + `/Assemblyordres`);
  }

  updateAssemblyOrder(id, order) {
    console.log('order status update', order);
    return this.http.post(
      this.assemblyService + `/Assemblyordres/${id}`,
      order
    );
  }

  addAssemblyLoadTag(orderId, loadTag) {
    return this.http.post(
      this.assemblyService + `/AssemblyLoadTags/${orderId}`,
      loadTag
    );
  }

  setAssemblyToComplete(id, produced, order) {
    console.log(id);
    console.log(produced);
    return this.http.post(
      this.assemblyService + `/CompleteAssembly/${id}/${produced}`, order
    );
  }
}
