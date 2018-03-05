import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { RelationService } from "./../services/relation.service";
import { MessageService } from "./../services/message.service";
import { ChatService } from "./../services/chat.service";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  @ViewChild('chat') private chat: ElementRef;
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  contact: string;
  messages: any;
  text: string = "";
  error: string = "";
  constructor(private route: ActivatedRoute, private session: SessionService,
    private relation: RelationService, private router: Router,
    private chatService: ChatService, private messageService: MessageService) { }

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
    this.messageService.getMessages(this.contact)
      .subscribe(
        (messages) => {
          this.messages = messages;

          this.messageService.chekMessages(this.contact)
            .subscribe(
            (result) => {},
            (err) => {
              this.error = err;
            });

          this.chatService.deleteMessagesFrom(this.contact);

          this.chat.nativeElement.scrollTop = 0;
        },
        (err) => {
          this.error = err;
        });
  }

  newMessage() {
    this.error = "";
    if (!this.text) {
      this.error = "Text is mandatory";
    } else {
      this.messageService.newMessage(this.contact, this.text)
        .subscribe(
        (result) => {
          this.loadPage();
          this.chatService.sendMessage({ from: this.currentUser._id, to: this.contact, text: this.text });
          this.text = '';
        },
        (err) => {
          this.error = err;
        });
    }
  }

}
