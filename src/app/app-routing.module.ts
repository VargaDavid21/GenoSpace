import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from "./features/landing-page/landing-page.component";
import {SearchPageComponent} from "./features/search-page/search-page.component";

const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  {path: 'search-page', component: SearchPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
