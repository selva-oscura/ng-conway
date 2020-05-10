import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  @Input() isAlive = 0;
  // isAlive = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
