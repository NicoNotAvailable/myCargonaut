import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import { LoginComponent} from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { FrontpageComponent } from "./frontpage/frontpage.component";
import { OfferComponent } from "./drive/offer/offer.component";
import { RequestComponent } from "./drive/request/request.component";
import { SummaryComponent } from "./drive/summary/summary.component";

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'offer', component: OfferComponent },
  { path: 'createrequest', component: RequestComponent },
  { path: 'createoffer', component: OfferComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'createregister', component: RegisterComponent },
  { path: '', component: FrontpageComponent },
];
