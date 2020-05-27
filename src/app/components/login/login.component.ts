import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentification/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private subscriptions: Subscription = new Subscription();
  constructor(private auth: AuthenticationService, private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder) { 
      console.log("from login");
      
    }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });

    if(this.auth.getusername() != null){
      this.router.navigate(['']);
    }

  }

  validate(loginFormValue: any) {

  this.subscriptions.add(this.auth.requestToken(loginFormValue.username, loginFormValue.password).subscribe(
      status => {
        if (status) {
          this.router.navigate(['']);
        } else {
          this.toastr.error('Not found!');
        }
      },
      error => {
        this.toastr.error('User not found!', error.status);
      }
    ));

  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  
}
