import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularTreeComponent } from './angular-tree.component';

@NgModule({
  declarations: [
    AngularTreeComponent,
		AbortController
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AngularTreeComponent
  ]
})
export class AngularTreeModule { }
