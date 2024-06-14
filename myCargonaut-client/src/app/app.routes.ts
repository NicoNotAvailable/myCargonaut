import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import {FrontpageComponent} from "./frontpage/frontpage.component";
import { ReviewComponent } from './review/review.component';

export const routes: Routes = [

  {path: '', component: FrontpageComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {path: 'profile', component: ProfileComponent},
  {path: 'review', component: ReviewComponent},
];
