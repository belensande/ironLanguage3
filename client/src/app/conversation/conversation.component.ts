import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { RelationService } from "./../services/relation.service";
import { ChatService } from "./../services/chat.service";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  contact: string;
  messages: any;
  text: string = "";
  error: string = "";
  constructor(private route: ActivatedRoute, private session: SessionService, private relation: RelationService, private router: Router, private chatService: ChatService) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (currentUser) => {
        if (!currentUser) {
          this.router.navigate(['/login']);
        } else {
          this.route.params.subscribe(params => {
            if (params['id']) {
              this.contact = params['id'];
              this.loadPage();
              this.chatService.messagesSubject.subscribe(
                (messages: any[]) => {
                  if (messages && messages.length && _.findWhere(messages, { from: this.contact }) !== undefined) {
                    this.loadPage();
                  }
                });
            } else {
              this.error = "No relation provided";
            }
          });
        }
      });
  }

  loadPage() {
    this.relation.getMessages()
      .subscribe(
      (user) => {
        this.currentUser = user;
        this.messages = _.filter(this.currentUser.messages, function (message: any) {
          return message.from._id == this.contact || message.to._id == this.contact;
        }, this);

        this.messages = _.sortBy(this.messages, 'created').reverse();

        this.relation.chekMessages(this.contact)
          .subscribe(
          (user) => { this.currentUser = user; },
          (err) => {
            this.error = err;
          });

        this.chatService.deleteMessagesFrom(this.contact);
      },
      (err) => {
        this.error = err;
      });
  }

  newMessage() {
    this.error = "";
    if (!this.text) {
      this.error = "Text is mandatory";
    }
    this.relation.newMessage(this.contact, this.text)
      .subscribe(
      (user) => {
        this.currentUser = user;

        this.messages = _.filter(this.currentUser.messages, function (message: any) {
          return message.from._id == this.contact || message.to._id == this.contact;
        }, this);

        this.messages = _.sortBy(this.messages, 'created').reverse();

        this.chatService.sendMessage({ from: this.currentUser._id, to: this.contact, text: this.text });

        this.text = '';
      },
      (err) => {
        this.error = err;
      });
  }

}
