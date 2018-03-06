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
          this.relation.getRelations().subscribe(
            (user) => {
              this.currentUser = user;

              this.currentUser.relations = _.chain(this.currentUser.relations)
                .sortBy("contact.username")
                .sortBy(function (rel) {
                  return rel.lastMessage ? - new Date(rel.lastMessage).getTime() : 0;
                }).value();

              this.chatService.messagesSubject.subscribe(
                (message: any) => {
                  this.currentUser.relations = _.map(this.currentUser.relations, rel => {
                    if (rel['_id'] == message.from._id) {
                      return _.extend(rel, { lastMessage: message.created_at, unchecked: rel['unchecked'] + 1 });
                    } else {
                      return rel;
                    }
                  })
                });
            },
            (err) => {
              this.error = err;
            });
        }
      });
  }

  accept(id) {
    this.relation.accept(id)
      .subscribe(
      (user) => {
        this.currentUser = user;
      },
      (err) => {
        this.error = err;
      });
  }
}
