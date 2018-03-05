import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { MeetupService } from "./../services/meetup.service";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-meetup-chat',
  templateUrl: './meetup-chat.component.html',
  styleUrls: ['./meetup-chat.component.css']
})
export class MeetupChatComponent implements OnInit {
  @ViewChild('chat') private chat: ElementRef;
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  id: string;
  messages: any;
  text: string = "";
  error: string = "";
  constructor(private session: SessionService, private router: Router,
    private meetupService: MeetupService, private route: ActivatedRoute) { }

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
              this.id = params['id'];
              this.meetupService.getMessages(this.id)
                .subscribe(
                (meetup) => {
                  this.messages = _.sortBy(meetup.messages, 'created').reverse();
                },
                (err) => {
                  this.error = err;
                });
            } else {
              this.error = "No meetup provided";
            }
          });
        }
      });
  }

  newMessage() {
    this.error = "";
    if (!this.text) {
      this.error = "Text is mandatory";
    } else {
      this.meetupService.sendMessage(this.id, { from: this.currentUser._id, text: this.text })
        .subscribe(
        (meetup) => {
          this.messages = _.sortBy(meetup.messages, 'created').reverse();
          this.text = '';
          this.chat.nativeElement.scrollTop = 0;
        },
        (err) => {
          this.error = err;
        });
    }
  }

}
