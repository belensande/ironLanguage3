import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
  formInfo: any = {
    username: "",
    password: ""
  };
  error: string;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.sessionService.isLogged()
      .subscribe(
      (user) => {
        if (user) {
          this.router.navigate(['/private']);
        }
      });
  }

  login() {
    this.error = "";
    this.sessionService.login(this.formInfo)
      .subscribe(
      (user) => {
        this.router.navigate(['/private']);
      },
      (err) => {
        this.error = err;
      });
  }
}
