import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import { LoginComponent} from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { FrontpageComponent } from "./frontpage/frontpage.component";
import { OfferComponent } from "./drive/offer/offer.component";
import { RequestComponent } from "./drive/request/request.component";
import { SummaryComponent } from "./drive/summary/summary.component";
import {SearchMainComponent} from "./search/search-main/search-main.component";

export const routes: Routes = [

  { path: '', component: FrontpageComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchMainComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'offer', component: OfferComponent },
  { path: 'createrequest', component: RequestComponent },
  { path: 'createoffer', component: OfferComponent },
  { path: 'summary', component: SummaryComponent },
  { path: '', component: FrontpageComponent },


];
