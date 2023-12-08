import { TuiRootModule } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageErrorComponent } from './pages/page-error/page-error.component';
import { LayoutMainComponent } from './layouts/layout-main/layout-main.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
	declarations: [
		AppComponent,
		PageErrorComponent,
		LayoutMainComponent,
		HeaderComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		TuiRootModule
  ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
