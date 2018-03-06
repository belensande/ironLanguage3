import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SessionService } from "./../services/session.service";
import { MessageService } from "./../services/message.service";
import * as io from 'socket.io-client';
import * as _ from 'underscore';

@Injectable()
export class ChatService {
  private url = 'http://localhost:3000';
  private socket;
  private messages: any[];
  public messagesSubject: Subject<any>;
  public newsSubject: Subject<number>;
  public chatSubject: Subject<any>;

  constructor(private sessionService: SessionService, private messageService: MessageService) {
    this.sessionService.isLogged().subscribe(
      (user) => {
        if (user) {
          this.connect(user._id);
        }
      });
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  deleteMessagesFrom(id) {
    this.messages = _.filter(this.messages, (msg: any) => { return msg.from._id != id });
    this.newsSubject.next(this.messages.length);
  }

  updateChat(message) {
    this.socket.emit('sendchat', message);
  }

  joinChat(meetupId) {
    this.socket.emit('adduser', meetupId);
  }

  leaveChat() {
    this.socket.emit('leavechat');
  }

  connect(id) {
    this.messagesSubject = new Subject();
    this.newsSubject = new Subject();
    this.chatSubject = new Subject();
    if (!this.socket) {
      this.socket = io(this.url, { query: "id=" + id });

      this.socket.on('connect', () => {
        this.messageService.getNews().subscribe(
          (messages: any[]) => {
            this.messages = messages || [];
            this.newsSubject.next(this.messages.length);
          },
          (err) => {
            this.messages = [];
          });
      });

      this.socket.on('message', (msg) => {
        this.messages.push(msg);
        this.messagesSubject.next(msg);
        this.newsSubject.next(this.messages.length);
      });

      this.socket.on('updatechat', (message) => {
        this.chatSubject.next(message);
      });
    } else {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.io.disconnect();
    }
  }
}
