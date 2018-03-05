import { Routes } from '@angular/router';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthSignupComponent } from './auth-signup/auth-signup.component';
import { MyPrivatePageComponent } from './my-private-page/my-private-page.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { RelationsComponent } from './relations/relations.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MeetupComponent } from './meetup/meetup.component';
import { MeetupListComponent } from './meetup-list/meetup-list.component';
import { MeetupDetailComponent } from './meetup-detail/meetup-detail.component'
import { MeetupChatComponent } from './meetup-chat/meetup-chat.component'

export const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'private', component: MyPrivatePageComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'signup', component: AuthSignupComponent },
  { path: 'edit', component: AuthSignupComponent },
  { path: 'search', component: ProfileSearchComponent },
  { path: 'relations', component: RelationsComponent },
  { path: 'relations/:id', component: ConversationComponent },
  { path: 'meetup/new', component: MeetupComponent },
  { path: 'meetup/list', component: MeetupListComponent },
  { path: 'meetup/:id', component: MeetupDetailComponent },
  { path: 'meetup-chat/:id', component: MeetupChatComponent },
  { path: '**', redirectTo: 'private' }
];
