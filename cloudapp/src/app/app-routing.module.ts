import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NewrouteComponent } from './newroute/newroute.component';
import { ThemingComponent } from './theming/theming.component';
import { SettingsComponent } from './settings/settings.component';
import { ParallelComponent } from './parallel/parallel.component';
import { ExternalComponent } from './external/external.component';
import { XmlComponent } from './xml/xml.component';
import { BindComponent } from './bind/bind.component';
import { StoreComponent } from './store/store.component';
import { TranslateComponent } from './translate/translate.component';
import { ConfigurationComponent, ConfigurationGuard } from './configuration/configuration.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { ErrorComponent } from './static/error.component';
import { StyleComponent } from './style/style.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'newroute', component: NewrouteComponent },
  { path: 'theming', component: ThemingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'parallel', component: ParallelComponent },
  { path: 'external', component: ExternalComponent },
  { path: 'xml', component: XmlComponent },
  { path: 'bind', component: BindComponent },
  { path: 'store', component: StoreComponent },
  { path: 'translate', component: TranslateComponent },
  { path: 'multi-select', component: MultiSelectComponent },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [ConfigurationGuard] },
  { path: 'style', component: StyleComponent },
  { path: 'error', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
