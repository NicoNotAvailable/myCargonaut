import { Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";

export const routes: Routes = [

  { path: 'register', component: RegisterComponent },

  {path: 'profile', component: ProfileComponent},
];
