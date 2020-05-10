import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './cell.component';



@NgModule({
  declarations: [
    CellComponent,
  ],
  exports: [
    CellComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class CellModule { }
