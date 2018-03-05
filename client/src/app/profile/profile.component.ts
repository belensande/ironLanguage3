import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { ProfileService } from "./../services/profile.service";
import { RelationService } from "./../services/relation.service";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  BASE_URL: String = 'http://localhost:3000';
  currentUser: any;
  status: String = "";
  user: any;
  error: String;

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
                  this.status = this.getStatus();
                });
            } else {
              this.user = currentUser;
            }
          });
        }
      });
  }

  getStatus(): String {
    if (this.currentUser._id != this.user._id) {
      if (this.currentUser.relations && _.findWhere(this.currentUser.relations, { contact: this.user._id }) !== undefined) {
        return '(In your contact list)';
      } else if (this.currentUser.petitions && _.findWhere(this.currentUser.petitions, { contact: this.user._id }) !== undefined) {
        return '(You have a request)';
      } else if (this.user.petitions && _.findWhere(this.user.petitions, { contact: this.currentUser._id }) !== undefined) {
        return '(Waiting to contact)';
      } else {
        return '(Not related)';
      }
    }
  }

  accept() {
    this.relation.accept(this.user._id)
      .subscribe(
        (user) => {
          this.router.navigate(['/relations']);
      });
  }

  askContact() {
    this.relation.askContact(this.user._id)
      .subscribe(
        (user) => {
          this.router.navigate(['/relations']);
      });
  }

}
