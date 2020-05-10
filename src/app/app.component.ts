import { OnInit, Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  seedDensity = .25;
  height: BehaviorSubject<number> = new BehaviorSubject(0);
  width: BehaviorSubject<number> = new BehaviorSubject(0);
  cellSize = 10;
  cellMargin = 1;
  numRows = 0;
  numCols = 0;
  grid: BehaviorSubject<Array<Array<number>>> = new BehaviorSubject([]);

  @HostListener('window:resize', [])
  private onResize() {
    const [oldNumRows, oldNumCols] = [this.numRows, this.numCols];
    this.updateDimensions();
    const updatedGrid = resizeGrid(this.grid.value, oldNumRows, this.numRows, oldNumCols, this.numCols);
    this.grid.next(updatedGrid);
  }

  ngOnInit() {
    this.updateDimensions();
    const initialGrid = instantiateGrid(this.numRows, this.numCols, this.seedDensity);
    this.grid.next(initialGrid);
  }

  private updateDimensions() {
    this.height.next(window.innerHeight);
    this.width.next(window.innerWidth);
    this.numRows = calculateRowOrColumnCount(this.height.value, this.cellMargin, this.cellSize);
    this.numCols = calculateRowOrColumnCount(this.width.value, this.cellMargin, this.cellSize);
  }
}

const instantiateGrid = (numRows: number, numCols: number, seedDensity): number[][] => {
  const grid: number[][] = [];
  for (let row = 0; row < numRows; row++) {
    const rowArray: number[] = [];
    for (let col = 0; col < numCols; col ++) {
      const isLive = Math.floor(Math.random() / seedDensity) === 0 ? 1 : 0;
      rowArray.push(isLive);
    }
    grid.push(rowArray);
  }
  return grid;
};

const resizeGrid = (oldGrid: number[][], oldNumRows: number, newNumRows: number, oldNumCols: number, newNumCols: number): number[][] => {
  let grid = oldGrid;
  const newCell = 0;
  // Remove bottom rows if number of rows has been reduced.
  if (oldNumRows > newNumRows) {
    grid = grid.slice(0, newNumRows);
  }
  // Add empty rows to bottom if number of rows has been increased.
  if (oldNumRows < newNumRows) {
    const newEmptyRow = new Array(oldNumCols).fill(newCell);
    grid.push([...newEmptyRow]);
  }

  // Remove rightmost cells in number of columns has been reduced.
  if (oldNumCols > newNumCols) {
    grid = grid.map((row: number[]) => row.slice(0, newNumCols));
  }
  // Add empty cells to right if number of columns has been increased.
  if (oldNumCols < newNumCols) {
    const newCells = new Array(newNumCols - oldNumCols).fill(newCell);
    grid = grid.map((row: number[]) => [...row, ...newCells]);
  }
  return grid;
};

const calculateRowOrColumnCount = (dimensionSize: number, cellMargin: number, cellSize: number): number => {
  return Math.floor((dimensionSize - 2 * cellMargin) / (cellSize + 2 * cellMargin));
};
