import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import {FrontpageComponent} from "./frontpage/frontpage.component";
import {SearchMainComponent} from "./search/search-main/search-main.component";
import {SearchMainGesuchtComponent} from "./search/search-suchen/search-main-gesucht/search-main-gesucht.component";

import {MeineAnfragenComponent} from "./meineAnfragenGesuche/meine-anfragen/meine-anfragen.component";
import {MeineGesucheComponent} from "./meineAnfragenGesuche/meine-gesuche/meine-gesuche.component";

import {RequestAufAnfrageOSucheComponent} from "./meineAnfragenGesuche/request-auf-anfrage-osuche/request-auf-anfrage-osuche.component";

import {TripsCreateComponent} from "./trips-create/trips-create.component";
import { DetailpageComponent } from "./detailpage/detailpage.component";

export const routes: Routes = [

  {path: '', component: FrontpageComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {path: 'profile', component: ProfileComponent},
  {path: 'searchOffer', component: SearchMainComponent},
  {path: 'searchRequest', component: SearchMainGesuchtComponent},

  {path: 'myOffer', component: MeineAnfragenComponent},
  {path: 'myRequest', component: MeineGesucheComponent},

  {path: 'request/:id', component: RequestAufAnfrageOSucheComponent},
  {path: 'offer/:id', component: RequestAufAnfrageOSucheComponent},

  {path: 'detail/request/:id', component: DetailpageComponent},
  {path: 'detail/offer/:id', component: DetailpageComponent},

  {path: 'trips/create', component: TripsCreateComponent},
];
