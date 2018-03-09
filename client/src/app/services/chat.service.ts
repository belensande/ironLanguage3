import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SessionService } from "./../services/session.service";
import { MessageService } from "./../services/message.service";
import { MeetupService } from "./../services/meetup.service";
import { RelationService } from "./../services/relation.service";
import * as io from 'socket.io-client';
import * as _ from 'underscore';
import { environment } from '../../environments/environment';

@Injectable()
export class ChatService {
  private url: string = environment.BASE_URL;
  private socket;
  private userId: string;

  private chatId: string;
  public messages: any[];
  public messageAdded = new Subject();
  public news: number = 0;
  public relations: any[];

  constructor(private sessionService: SessionService, private relationService: RelationService,
    private messageService: MessageService, private meetupService: MeetupService) {
    this.sessionService.isLogged().subscribe(
      (user) => {
        if (user) {
          this.connect(user._id);
        }
      });
  }

  manageNews(newMessages) {
    this.news = newMessages;
  }

  viewRelations(relations: any[]) {
    this.relations = _.sortBy(relations, function (rel) {
      return rel.lastUpdate ? - new Date(rel.lastUpdate).getTime() : - new Date(rel.created).getTime();
    });
  };

  leaveRelations() {
    this.relations = [];
  }

  sendMessage(message) {
    this.messages = _.map(this.messages, (msg) => {
      if (msg.from._id != this.userId) {
        msg.checked = true;
      }
      return msg;
    });
    this.messages.unshift(message);
    this.messageAdded.next(false);
    this.socket.emit('add-message', message);
  }

  joinPrivateChat(id, messages) {
    this.chatId = id;
    this.messages = messages;
        
    const messagesChecked = _.reduce(this.messages, (total, msg) => {
      return msg.from._id == this.chatId && !msg.checked ? ++total : total;
    }, 0);
    this.news = this.news >= messagesChecked ? this.news - messagesChecked : 0;
  }

  leavePrivateChat() {
    this.chatId = "";
    this.messages = [];
  }

  updateChat(message) {
    this.socket.emit('sendchat', message);
  }

  joinChat(meetupId, messages) {
    this.messages = this.messages = _.sortBy(messages, 'created_at').reverse();
    this.socket.emit('adduser', meetupId);
  }

  leaveChat() {
    this.messages = [];
    this.socket.emit('leavechat');
  }

  connect(id) {
    this.userId = id;
    if (!this.socket) {
      this.socket = io(this.url, { query: "id=" + this.userId });

      this.socket.on('message', (msg) => {
        if (this.chatId && this.chatId == msg.from._id) {
          this.messages.unshift(msg);
          this.messageAdded.next(true);
        } else {
          this.news++;
        }

        if (this.relations) {
          this.relations = _.map(this.relations, (rel) => {
            if (rel.contact._id == msg.from._id) {
              rel.lastUpdate = msg.created_at;
              rel.newMessages++;
            }
            return rel;
          });
        }
      });

      this.socket.on('updatechat', (message) => {
        if (message.from._id != this.userId) {
          message['new'] = true;
          this.messages.unshift(message);
          this.messageAdded.next(true);
        } else {
          this.messages = _.map(this.messages, (msg) => {
            delete msg['new'];
            return msg;
          });
        }
      });
    } else {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.chatId = "";
      this.messages = [];
      this.news = 0;
      this.relations = [];
      this.socket.io.disconnect();
    }
  }
}
