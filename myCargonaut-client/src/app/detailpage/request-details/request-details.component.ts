import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.css'
})
export class RequestDetailsComponent {
  @Input() request!: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRequest();
  }

  getRequest(): void {
    this.http.get("http://localhost:8000/drive/request/" + this.request, { withCredentials: true }).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    )
  }
}
