import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as Sentry from "@sentry/browser";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  count = 0;
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    this.count++;
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            console.log(error);
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          //  Sentry.captureException(error);
          } else {
            console.log(error);
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          //  Sentry.captureException(error);
          }
          // window.alert(errorMessage);
          this.toastr.error(errorMessage, 'Oops!');
          return throwError(errorMessage);
        }),
        finalize(() => {
          this.count--;
          if (this.count == 0) this.spinner.hide()
        })
      )
  }
}