import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { OrderDeliveryComponent } from './components/order-delivery/order-delivery.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { ClientsAdministrationComponent } from './components/clients-administration/clients-administration.component';
import { PackagingAdministrationComponent } from './components/packaging-administration/packaging-administration.component';
import { SecurityLabelComponent } from './components/security-label/security-label.component';
import { AssemblyComponent } from './components/assembly/assembly.component';
import { PackingSlipsComponent } from './components/packing-slips/packing-slips.component';


const routes: Routes = [

  { path: '', component: HomeComponent, children :  [
    { path: '', redirectTo: 'order-delivery', pathMatch: 'full' },
    { path: 'label-generator', component: DashboardComponent},
    { path: 'order-delivery', component: OrderDeliveryComponent},
    { path: 'shipping', component: ShippingComponent},
    { path: 'clients', component: ClientsAdministrationComponent},
    { path: 'packaging', component: PackagingAdministrationComponent},   
    { path: 'security-label', component: SecurityLabelComponent}, 
    { path: 'assembly', component: AssemblyComponent},
    { path: 'packing-slip', component: PackingSlipsComponent},


  ] },
  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
