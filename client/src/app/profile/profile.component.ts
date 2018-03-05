import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { ProfileService } from "./../services/profile.service";
import { RelationService } from "./../services/relation.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  user: any;
  error: string;

  constructor(private session: SessionService, private relation: RelationService, private profile: ProfileService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (currentUser) => {
        if (!currentUser) {
          this.router.navigate(['/login']);
        } else {
          this.currentUser = currentUser;
          this.route.params.subscribe(params => {
            if (params['id']) {
              this.profile.get(params['id'])
                .subscribe(
                (user) => {
                  this.user = user;
                });
            } else {
              this.user = currentUser;
            }
          });
        }
      });
  }

  accept() {
    this.relation.accept(this.user._id)
      .subscribe(
        (user) => {
          this.currentUser = user;
          this.router.navigate(['/relations']);
      });
  }

  askContact() {
    this.relation.askContact(this.user._id)
      .subscribe(
      (user) => {
        this.user = user;
        this.router.navigate(['/relations']);
      });
  }

}
