import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {FeaturesModule} from "../features/features.module";
import {RouterOutlet} from "@angular/router";


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    FeaturesModule,
    RouterOutlet
  ],
  exports: [
    MainComponent,
  ]
})
export class LayoutModule { }
