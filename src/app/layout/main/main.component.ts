import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {NavigationStart, Router} from "@angular/router";
import {User} from "firebase/auth";
import {filter} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loading: boolean = false;
  userSignedIn: boolean = false;
  authChecked: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user: User | null) => {
      this.userSignedIn = !!user;
      this.authChecked = true;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.loading = true;
    });

    this.router.events.subscribe(() => {
      this.loading = false;
    });
  }
}
