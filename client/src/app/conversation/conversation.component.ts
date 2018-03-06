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
              this.messageService.getMessages(this.contact)
                .subscribe(
                (messages) => {
                  this.messages = messages;

                  this.messageService.chekMessages(this.contact)
                    .subscribe(
                    (user) => {
                      this.currentUser = user;
                      this.chatService.deleteMessagesFrom(this.contact);
                    },
                    (err) => {
                      this.error = err;
                    });

                  this.chatService.messagesSubject.subscribe(
                    (message: any) => {
                      if (message && message.from._id == this.contact) {
                        this.messageService.chekMessages(this.contact)
                          .subscribe(
                          (user) => {
                            this.currentUser = user;
                            this.chatService.deleteMessagesFrom(this.contact);
                            this.messages = _.map(this.messages, (msg: any) => {
                              msg.checked = true;
                              return msg;
                            });
                            this.messages.unshift(message);
                          },
                          (err) => {
                            this.error = err;
                          });
                      }
                    });
                },
                (err) => {
                  this.error = err;
                });
            } else {
              this.error = "No relation provided";
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
      this.messageService.newMessage(this.contact, this.text)
        .subscribe(
        (message) => {
          this.messages.unshift(message);
          this.chatService.sendMessage(message);
          this.text = '';
          this.chat.nativeElement.scrollTop = 0;
        },
        (err) => {
          this.error = err;
        });
    }
  }

}
