import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import {FrontpageComponent} from "./frontpage/frontpage.component";
import {SearchMainComponent} from "./search/search-main/search-main.component";
import {SearchMainGesuchtComponent} from "./search/search-suchen/search-main-gesucht/search-main-gesucht.component";

import {MeineAnfragenComponent} from "./meineAnfragenGesuche/meine-anfragen/meine-anfragen.component";
import {MeineGesucheComponent} from "./meineAnfragenGesuche/meine-gesuche/meine-gesuche.component";

export const routes: Routes = [

  {path: '', component: FrontpageComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {path: 'profile', component: ProfileComponent},
  {path: 'searchOffer', component: SearchMainComponent},
  {path: 'searchRequest', component: SearchMainGesuchtComponent},
  {path: 'myOffer', component: MeineAnfragenComponent},
  {path: 'myRequest', component: MeineGesucheComponent},

];
