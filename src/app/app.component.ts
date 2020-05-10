import { AfterViewInit, Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  seedDensity = .25;
  height: BehaviorSubject<number> = new BehaviorSubject(0);
  width: BehaviorSubject<number> = new BehaviorSubject(0);
  cellSize = 10;
  cellMargin = 1;
  numRows = 0;
  numCols = 0;
  grid: Array<Array<number>> = [];

  @HostListener('window:resize', [])
  private onResize() {
    this.updateDimensions();
  }

  ngAfterViewInit() {
    this.updateDimensions();
    this.generateGrid();
  }

  private updateDimensions() {
    this.height.next(window.innerHeight);
    this.width.next(window.innerWidth);
    this.numRows = calculateRowOrColumnCount(this.height.value, this.cellMargin, this.cellSize);
    this.numCols = calculateRowOrColumnCount(this.width.value, this.cellMargin, this.cellSize);
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

const calculateRowOrColumnCount = (dimensionSize: number, cellMargin: number, cellSize: number): number => {
  return Math.floor((dimensionSize - 2 * cellMargin) / (cellSize + 2 * cellMargin))
};
