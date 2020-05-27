import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { ConfigurationService } from './configuration.service';


@Injectable({
    providedIn: 'root'
  })
export class HttpCallsService{
    
    private appUrl : string;

    constructor(private http: HttpClient,private configurationService : ConfigurationService) {
      this.appUrl = this.configurationService.get("Api_Base");
    }   

    public callAppGet(serviceUrl : string): Observable<any>  { 

      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }

        return this.http.get(this.appUrl + serviceUrl);       
     }

     public callAppGetWithHeaders(serviceUrl : string, header: any): Observable<any>  { 

      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }

        return this.http.get(this.appUrl + serviceUrl, header);       
     }

     public callAppDelete(serviceUrl : string): Observable<any>  { 

      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }

        return this.http.delete(this.appUrl + serviceUrl);       
     }
    
    public callAppPost(serviceUrl : string, postData : any): Observable<any>  { 
      
      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }
        
        return this.http.post(this.appUrl + serviceUrl, postData);       
     }

     public callAppPut(serviceUrl : string, postData : any): Observable<any>  { 
      
      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }
        
        return this.http.put(this.appUrl + serviceUrl, postData);       
     }

     public callAppPostWithHeader(serviceUrl : string, postData : any, header :any): Observable<any>  { 
      
      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }
      
        return this.http.post(this.appUrl + serviceUrl, postData, header);       
     }

     public callAppPutWithHeader(serviceUrl : string, postData : any, header :any): Observable<any>  { 
      
      if(!serviceUrl.startsWith("/")){
        serviceUrl = "/" + serviceUrl;
      }
      
        return this.http.put(this.appUrl + serviceUrl, postData, header);       
     }

}