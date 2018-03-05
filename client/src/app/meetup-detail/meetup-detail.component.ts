import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { MeetupService } from "./../services/meetup.service";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-meetup-detail',
  templateUrl: './meetup-detail.component.html',
  styleUrls: ['./meetup-detail.component.css']
})
export class MeetupDetailComponent implements OnInit {
  meetup: any;
  currentUser: any;
  assistant: boolean;
  constructor(private meetupService: MeetupService, private session: SessionService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {
          this.currentUser = user;
          this.route.params.subscribe(params => {
            this.meetupService.getDetail(params['id'])
              .subscribe(
              (meetup) => {
                this.meetup = meetup;
                this.assistant = _.findWhere(meetup.assist, { _id: this.currentUser._id }) ? true : false;
              });
          });
        }
      });
  }

  assist() {
    this.meetupService.assist(this.meetup._id, this.currentUser._id)
      .subscribe(
      (meetup) => {
        this.meetup = meetup;
        this.assistant = _.findWhere(meetup.assist, { _id: this.currentUser._id }) ? true : false;
      });
  }

}
