import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { RelationService } from "./../services/relation.service";
import { ChatService } from "./../services/chat.service";
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css']
})
export class RelationsComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  messages: any;
  error: string = "";
  constructor(private session: SessionService, private relation: RelationService,
    private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (currentUser) => {
        if (!currentUser) {
          this.router.navigate(['/login']);
        } else {
          this.loadPage();
          this.chatService.messagesSubject.subscribe(
            (messages: any[]) => {
              if (messages && messages.length) {
                this.loadPage();
              }
            });
        }
      });
  }

  loadPage() {
    this.relation.getRelations().subscribe(
      (user) => {
        this.currentUser = user;

        this.messages = _.groupBy(user.messages, function (message: any) {
          return message.from != this.currentUser._id ? message.from : message.to;
        }, this);

        this.messages = _.mapObject(this.messages, function (list: any[], key) {
          let news = _.reduce(list, function (news, msg) {
            if (!msg.checked && msg.to == this.currentUser._id) { return ++news; }
            return news;
          }, 0, this);
          return { 'messages': list, 'news': news }
        }, this);

        this.currentUser.relations = _.sortBy(this.currentUser.relations, function (a: any, b: any) {
          let aDate = this.messages[a] ? this.messages[a][0].created : 0;
          let bDate = this.messages[b] ? this.messages[b][0].created : 0;
          return (aDate || bDate) ? (!aDate ? 1 : !bDate ? -1 : bDate - aDate) : a.username - b.username;
        }, this);

      },
      (err) => {
        this.error = err;
      });
  }

}
