import {Component} from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import { User } from 'firebase/auth';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1s ease-out', style({opacity: 1})),
      ]),
    ])
  ]
})
export class LandingPageComponent {
  userSignedIn: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getUser().subscribe((user: User | null) => {
      this.userSignedIn = !!user;
    });
  }

  signIn() {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/search-page']);
    }).catch((error) => {
      this.errorMessage = 'An error occurred while signing in. Please try again.';
    });
  }
}
