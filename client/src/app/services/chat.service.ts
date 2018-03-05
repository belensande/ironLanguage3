import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SessionService } from "./../services/session.service";
import * as io from 'socket.io-client';
import * as _ from 'underscore';

@Injectable()
export class ChatService implements OnDestroy{
  private url = 'http://localhost:3000';
  private socket;
  private messages: any[];
  public messagesSubject = new Subject();

  constructor(private sessionService: SessionService) {
    this.sessionService.isLogged().subscribe(
      (user) => {
        if (user) {
          this.connect(user._id);
        }
      }
    );
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  deleteMessagesFrom(id) {
    this.messages = _.difference(this.messages, _.where(this.messages, {
      from: id
    }));
    this.messagesSubject.next(this.messages);
  }

  connect(id) {
    if (!this.socket) {
      this.socket = io(this.url, { query: "id=" + id });
      this.socket.on('connect', () => this.messages = []);
      this.socket.on('message', (msg) => {
        this.messages.push(msg);
        this.messagesSubject.next(this.messages);
      });
      this.socket.on('disconnect', () => delete this.messages);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
