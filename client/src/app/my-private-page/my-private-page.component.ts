import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { MeetupService } from "./../services/meetup.service";
import { RelationService } from "./../services/relation.service";
import { MessageService } from "./../services/message.service";
import { ChatService } from "./../services/chat.service";
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-my-private-page',
  templateUrl: './my-private-page.component.html',
  styleUrls: ['./my-private-page.component.css']
})
export class MyPrivatePageComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  meetups: Number;
  assistMeetups: Number;
  newMessages: Number;
  ownMeetups: Number;
  petitions: Number;
  relations: Number;
  error: string;

  constructor(private session: SessionService, private meetup: MeetupService,
    private relation: RelationService, private chatService: ChatService,
    private messageService: MessageService, private router: Router) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {
          this.meetup.get(user.city)
            .subscribe(meetups => {
              this.meetups = meetups ? meetups.length : 0;
            });

          this.meetup.getAssist(user._id)
            .subscribe(meetups => {
              this.assistMeetups = meetups ? meetups.length: 0;
            });

          this.meetup.getOwned(user._id)
            .subscribe(meetups => {
              this.ownMeetups = meetups ? meetups.length : 0;
            });

          this.relation.getRelations().subscribe(
            (user) => {
              this.currentUser = user;
              this.petitions = user.petitions ? user.petitions.length : 0;
              this.relations = user.relations ? user.relations.length : 0;
            },
            (err) => {
              this.error = err;
            });

          this.loadMessages();

          this.chatService.messagesSubject.subscribe(
            (messages: any[]) => {
              this.loadMessages();
            });
        }
      });
  }

  loadMessages() {
    this.messageService.getNews().subscribe(
      (messages) => {
        this.newMessages = messages ? messages.length : 0;
      },
      (err) => {
        this.error = err;
      });
  }
}
