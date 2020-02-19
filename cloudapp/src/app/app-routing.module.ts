import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NewrouteComponent } from './newroute/newroute.component';
import { ThemingComponent } from './theming/theming.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'newroute', component: NewrouteComponent },
  { path: 'theming', component: ThemingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
