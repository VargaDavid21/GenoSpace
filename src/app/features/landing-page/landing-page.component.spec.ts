import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LandingPageComponent} from './landing-page.component';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of(null)),
      signInWithGoogle: jasmine.createSpy('signInWithGoogle').and.returnValue(Promise.resolve())
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign in with Google when sign-in button is clicked', () => {
    const signInButton = fixture.debugElement.query(By.css('.sign-in')).nativeElement;
    signInButton.click();
    expect(authServiceMock.signInWithGoogle).toHaveBeenCalled();
  });

  it('should navigate to search-page after successful sign-in', async () => {
    await component.signIn();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/search-page']);
  });
});
