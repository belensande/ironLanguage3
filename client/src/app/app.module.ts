import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SessionService } from "./services/session.service";
import { CollectionsService } from "./services/collections.service";
import { ProfileService } from "./services/profile.service";
import { RelationService } from "./services/relation.service";
import { MeetupService } from "./services/meetup.service";
import { ChatService } from "./services/chat.service";
import { RouterModule } from "@angular/router";
import { FileSelectDirective } from "ng2-file-upload";
import { routes } from './routes';
import { AppComponent } from './app.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthSignupComponent } from './auth-signup/auth-signup.component';
import { MyPrivatePageComponent } from './my-private-page/my-private-page.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { RelationsComponent } from './relations/relations.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MeetupComponent } from './meetup/meetup.component';
import { MeetupListComponent } from './meetup-list/meetup-list.component';
import { AgmCoreModule } from '@agm/core';
import { MeetupDetailComponent } from './meetup-detail/meetup-detail.component'

@NgModule({
  declarations: [
    AppComponent,
    AuthLoginComponent,
    AuthSignupComponent,
    MyPrivatePageComponent,
    FileSelectDirective,
    ProfileComponent,
    ProfileSearchComponent,
    RelationsComponent,
    ConversationComponent,
    MeetupComponent,
    MeetupListComponent,
    MeetupDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDlq0n-GhsBi575QJmwr9i8O3kzY0xiyi0',
      libraries: ['places']
    })
  ],
  providers: [SessionService, CollectionsService, ProfileService, RelationService, MeetupService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
