import {Component, inject} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    NgIf
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  templateToLoad: string = "summaryOffer";

  public sessionService: SessionService = inject(SessionService);

  isLoggedIn: boolean = false;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });

    this.route.queryParams.subscribe(params => {
      const origin = params['origin'];
      if (origin === 'request') {
        this.templateToLoad = 'summaryRequest';
      } else if (origin === 'offer') {
        this.templateToLoad = 'summaryOffer';
      }
    });
  }

  saveOffer(form: NgForm) {

  }
}
