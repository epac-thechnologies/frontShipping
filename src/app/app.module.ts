import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, Injectable, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfigurationService } from './services/configuration.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { DatatableComponent } from './components/shared/datatable/datatable.component';
import { StorageServiceModule } from 'angular-webstorage-service';

//primeng
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
// ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxSpinnerModule } from "ngx-spinner";
import { OrderDeliveryComponent } from './components/order-delivery/order-delivery.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { PackingSlipTemplateComponent } from './components/templates/packing-slip-template/packing-slip-template.component';
import { ClientsAdministrationComponent } from './components/clients-administration/clients-administration.component';
import { PackagingAdministrationComponent } from './components/packaging-administration/packaging-administration.component';
import { LoadTagComponent } from './components/templates/load-tag/load-tag.component';
import { NgxPrintModule } from 'ngx-print';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SecurityLabelComponent } from './components/security-label/security-label.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
// sentry logger start
import * as Sentry from "@sentry/browser";// sentry logger
import { FieldPipe } from './pipes/field.pipe';
import { AssemblyComponent } from './components/assembly/assembly.component';
import { PackingSlipsComponent } from './components/packing-slips/packing-slips.component';
Sentry.init({
  dsn: "https://2f50b0c248d54c8898391bb4f24d37e5@sentry.io/5184821"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
  //  Sentry.showReportDialog({ eventId });
  }
}
/*
Sentry.configureScope((scope)=>{
  scope.setUser({email:'maamouri.bilel@gmail.com'});
});
*/
// sentry logger end

export function ConfigLoader(cfg: ConfigurationService) {
  return () => cfg.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,
    HomeComponent,
    DatatableComponent,
    OrderDeliveryComponent,
    ShippingComponent,
    PackingSlipTemplateComponent,
    ClientsAdministrationComponent,
    PackagingAdministrationComponent,
    LoadTagComponent,
    SecurityLabelComponent,
    AssemblyComponent,
    FieldPipe,
    PackingSlipsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    NgxWebstorageModule.forRoot(),
    ToastrModule.forRoot(),
    StorageServiceModule,
    TableModule, // prime
    DropdownModule, // prime
    MultiSelectModule,
    SelectButtonModule,
    CalendarModule, // prime
    NgxBarcodeModule,
    NgxSpinnerModule,
    NgxPrintModule,
    ConfirmDialogModule,




  ],
  providers: [
    // config initializer
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigurationService],
      multi: true
    },
    // http interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    // Sentry logger
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler
    },
    ConfigurationService,
    ConfirmationService,


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
