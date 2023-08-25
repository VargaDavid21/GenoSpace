import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {SearchPageComponent} from './search-page/search-page.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    LandingPageComponent,
    SearchPageComponent,
  ],
  exports: [
    LandingPageComponent,
    SearchPageComponent
  ],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        MatTooltipModule,
    ]
})
export class FeaturesModule {
}
