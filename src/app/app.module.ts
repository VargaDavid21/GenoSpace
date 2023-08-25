import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule} from "./layout/layout.module";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {HttpClientModule} from "@angular/common/http";

const firebaseConfig = {
  apiKey: "AIzaSyDd9aMY2RjlJgCnMOTgYmt439zWZqwqLQ0",
  authDomain: "genospace.firebaseapp.com",
  projectId: "genospace",
  storageBucket: "genospace.appspot.com",
  messagingSenderId: "413952996644",
  appId: "1:413952996644:web:3873e2197ae6d9d3912fb1",
  measurementId: "G-W1YQ8PQ6WR"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
