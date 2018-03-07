import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { RelationService } from "./../services/relation.service";
import { MessageService } from "./../services/message.service";
import { ChatService } from "./../services/chat.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'underscore';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild('chat') private chat: ElementRef;

  currentUser: any;
  contact: string;
  text: string = "";
  error: string = "";
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private session: SessionService,
    private relation: RelationService, private router: Router,
    public chatService: ChatService, private messageService: MessageService) { }

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
                  this.chatService.joinPrivateChat(this.contact, messages);

                  this.subscription = this.chatService.messageAdded.subscribe(
                    (received) => {
                      if (received) {
                        this.checkMessages();
                      }
                      this.chat.nativeElement.scrollTop = 0;
                    });

                    this.checkMessages();
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

  checkMessages() {
    this.messageService.chekMessages(this.contact)
      .subscribe(
      (user) => {
        this.currentUser = user;
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
        (message) => {
          this.chatService.sendMessage(message);
          this.text = '';
        },
        (err) => {
          this.error = err;
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chatService) {
      this.chatService.leavePrivateChat();
    }
  }

}
