import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { MeetupService } from "./../services/meetup.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from "./../services/chat.service";
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'underscore';

@Component({
  selector: 'app-meetup-chat',
  templateUrl: './meetup-chat.component.html',
  styleUrls: ['./meetup-chat.component.css']
})
export class MeetupChatComponent implements OnInit, OnDestroy {
  @ViewChild('chat') private chat: ElementRef;
  BASE_URL: String = 'http://localhost:3000';
  currentUser: any;
  id: string;
  text: string = "";
  error: string = "";
  subscription: Subscription;

  constructor(private session: SessionService, private router: Router,
    private meetupService: MeetupService, private route: ActivatedRoute,
    public chatService: ChatService) { }

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
                (messages) => {
                  this.chatService.joinChat(this.id, messages);
                  this.subscription = this.chatService.messageAdded.subscribe(
                    (added) => {
                      this.chat.nativeElement.scrollTop = 0;
                    });
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
      this.meetupService.sendMessage({ meetup: this.id, from: this.currentUser._id, text: this.text })
        .subscribe(
        (msg) => {
          this.chatService.messages.unshift(msg);
          this.chatService.updateChat(msg);
          this.chat.nativeElement.scrollTop = 0;
          this.text = '';
        },
        (err) => {
          this.error = err;
        });
    }
  }

  ngOnDestroy() {
    this.chatService.leaveChat();
    this.subscription.unsubscribe();
  }
}
