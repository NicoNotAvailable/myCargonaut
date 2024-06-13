import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import {FrontpageComponent} from "./frontpage/frontpage.component";
import { OfferComponent } from "./drive/offer/offer.component";
import { RequestComponent } from "./drive/request/request.component";

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'offer', component: OfferComponent },
  { path: 'request', component: RequestComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: FrontpageComponent },
];
