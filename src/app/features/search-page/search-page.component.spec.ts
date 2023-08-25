import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchPageComponent} from './search-page.component';
import {NcbiService} from '../../services/ncbi/ncbi.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let ncbiService: NcbiService;
  let authService: AuthService;
  let router: Router;
  let afAuth: AngularFireAuth;

  beforeEach(() => {
    const ncbiServiceStub = {getSummaryById: jasmine.createSpy('getSummaryById').and.returnValue(of([]))};
    const authServiceStub = {}; // Add methods if needed
    const routerStub = {navigate: jasmine.createSpy('navigate')};
    const afAuthStub = {signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve())};

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SearchPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: NcbiService, useValue: ncbiServiceStub},
        {provide: AuthService, useValue: authServiceStub},
        {provide: Router, useValue: routerStub},
        {provide: AngularFireAuth, useValue: afAuthStub}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    ncbiService = TestBed.inject(NcbiService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    afAuth = TestBed.inject(AngularFireAuth);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the ncbiService.getSummaryById method with entrezNumber', () => {
    component.entrezNumber = 'test-number';
    component.search();
    expect(ncbiService.getSummaryById).toHaveBeenCalledWith('test-number');
  });

  it('should return true if numbers are duplicated', () => {
    component.entrezNumber = '1 1 2';
    expect(component.isSearchDisabled()).toBeTrue();
    expect(component.tooltipMessage).toEqual('Please enter each number only once.');
  });

  it('should return false if numbers are unique', () => {
    component.entrezNumber = '1 2 3';
    expect(component.isSearchDisabled()).toBeFalse();
    expect(component.tooltipMessage).toEqual('');
  });
});
