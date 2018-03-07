import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { SessionService } from "./services/session.service";
import { MessageService } from "./services/message.service";
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService, private router: Router,
    private messageService: MessageService, public chatService: ChatService) { }
  userLogged: boolean = false;
  id: string = "";

  ngOnInit() {
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialise();
      }
    });
  }

  initialise() {
    this.sessionService.isLogged()
      .subscribe(
        (user) => {
          if (user) {
            this.userLogged = true;
            this.id = user._id;
            this.messageService.getNews().subscribe(
              (messages) => {
                this.chatService.manageNews(messages);
              });
          } else {
            this.userLogged = false;
            this.id = "";
          }
      });
  }

  logout() {
    this.sessionService.logout()
      .subscribe(
        () => {
          this.userLogged = false;
          this.id = "";
          this.chatService.disconnect();
          this.router.navigate(['/login']);
      });
  }

}
