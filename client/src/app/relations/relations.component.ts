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
    public chatService: ChatService, private router: Router) { }

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
              this.chatService.viewRelations(user.relations);
            },
            (err) => {
              this.error = err;
            }
          );
        }
      });
  }

  accept(id) {
    this.relation.accept(id)
      .subscribe(
      (user) => {
        this.currentUser = user;
        this.chatService.viewRelations(user.relations);
      },
      (err) => {
        this.error = err;
      });
  }
}
