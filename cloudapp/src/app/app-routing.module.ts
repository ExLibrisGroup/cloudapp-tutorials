import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NewrouteComponent } from './newroute/newroute.component';
import { ThemingComponent } from './theming/theming.component';
import { SettingsComponent } from './settings/settings.component';
import { ParallelComponent } from './parallel/parallel.component';
import { ExternalComponent } from './external/external.component';
import { XmlComponent } from './xml/xml.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'newroute', component: NewrouteComponent },
  { path: 'theming', component: ThemingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'parallel', component: ParallelComponent },
  { path: 'external', component: ExternalComponent },
  { path: 'xml', component: XmlComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
