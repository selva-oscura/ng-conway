import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  seedDensity = .25;
  numRows = 20;
  numCols = 40;
  grid: Array<Array<number>> = [];

  ngOnInit() {
    this.generateGrid();
  }

  private generateGrid() {
    const grid: number[][] = [];
    for (let row = 0; row < this.numRows; row++) {
      const rowArray: number[] = [];
      for (let col = 0; col < this.numCols; col ++) {
        const isLive = Math.floor(Math.random() / this.seedDensity) === 0 ? 1 : 0;
        rowArray.push(isLive);
      }
      grid.push(rowArray);
    }
    this.grid = grid;
  }
}
