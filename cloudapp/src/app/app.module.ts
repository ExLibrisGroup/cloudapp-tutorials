import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, getTranslateModule } from '@exlibris/exl-cloudapp-angular-lib';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
import { NewrouteComponent } from './newroute/newroute.component';
import { ThemingComponent } from './theming/theming.component';
import { SettingsComponent } from './settings/settings.component';
import { ParallelComponent } from './parallel/parallel.component';
import { ExternalComponent } from './external/external.component';
import { XmlComponent } from './xml/xml.component';
import { BindComponent } from './bind/bind.component';
import { StoreComponent } from './store/store.component';
import { TranslateComponent } from './translate/translate.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { SelectEntitiesComponent } from './multi-select/select-entities/select-entities.component';
import { LightboxComponent } from './external/lightbox/lightbox.component'

export function getToastrModule() {
  return ToastrModule.forRoot({
    positionClass: 'toast-top-right',
    timeOut: 2000
  });
}

@NgModule({
   declarations: [
      AppComponent,
      MainComponent,
      TopmenuComponent,
      NewrouteComponent,
      ThemingComponent,
      SettingsComponent,
      ParallelComponent,
      ExternalComponent,
      XmlComponent,
      BindComponent,
      StoreComponent,
      TranslateComponent,
      ConfigurationComponent,
      MultiSelectComponent,
      SelectEntitiesComponent,
      LightboxComponent
   ],
   imports: [
      MaterialModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      getTranslateModule(),
      getToastrModule()
   ],
   providers: [
      Title
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
