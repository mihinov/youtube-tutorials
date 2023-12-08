import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageErrorComponent } from './pages/page-error/page-error.component';

@NgModule({
	declarations: [
		AppComponent,
		PageErrorComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule
  ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
