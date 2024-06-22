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

import { TripsComponent } from './trips/trips.component';

export const routes: Routes = [

  { path: '', component: FrontpageComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'createrequest', component: RequestComponent },
  { path: 'createoffer', component: OfferComponent },
  { path: 'summary', component: SummaryComponent },
  { path: '', component: FrontpageComponent },

  {path: 'searchOffer', component: SearchMainComponent},
  {path: 'searchRequest', component: SearchMainGesuchtComponent},

  {path: 'myOffer', component: MeineAnfragenComponent},
  {path: 'myRequest', component: MeineGesucheComponent},

  {path: 'request/:id', component: RequestAufAnfrageOSucheComponent},
  {path: 'offer/:id', component: RequestAufAnfrageOSucheComponent},

  {path: 'trips/:type/:id', component: TripsComponent},
];
