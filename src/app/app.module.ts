/**
 * Main Module of application.
 *
 * All libraries, app components, app directives and services are listed here.
 */


/************************************************************************************
 * Angular Libraries.
 *************************************************************************************/

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/************************************************************************************
 * External libraries
 *************************************************************************************/
// None

/************************************************************************************
 * Application Components
 *************************************************************************************/

import {AppComponent} from './app.component';
import {SearchBoxComponent} from './components';

/************************************************************************************
 * Application Directives
 *************************************************************************************/

import {ClickOutsideDirective} from './directives';

/************************************************************************************
 * Application Services.
 *************************************************************************************/

import {MockServerService} from './services';

/************************************************************************************
 * Application Module.
 *************************************************************************************/

@NgModule({
  declarations: [
    AppComponent,
    ClickOutsideDirective,
    SearchBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MockServerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
