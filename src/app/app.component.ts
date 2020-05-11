import { OnInit, Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  seedDensity = .08;
  refreshPeriodInMS = 1500;
  height: BehaviorSubject<number> = new BehaviorSubject(0);
  width: BehaviorSubject<number> = new BehaviorSubject(0);
  cellSize = 8;
  cellMargin = 0;
  numRows = 0;
  numCols = 0;
  grid: BehaviorSubject<Array<Array<number>>> = new BehaviorSubject([]);
  shouldResizeGrid = false;

  @HostListener('window:resize', [])
  private onResize() {
    this.shouldResizeGrid = true;
  }

  ngOnInit() {
    this.updateDimensions();
    const initialGrid = instantiateGrid(this.numRows, this.numCols, this.seedDensity);
    this.grid.next(initialGrid);

    setInterval(() => {
      const grid = this.shouldResizeGrid ? this.resizeGrid() : this.grid.value;
      this.shouldResizeGrid = false;
      this.grid.next(getNextGenerationGrid(grid));
      console.log('tick');
    }, this.refreshPeriodInMS);
  }

  private updateDimensions() {
    this.height.next(window.innerHeight);
    this.width.next(window.innerWidth);
    this.numRows = calculateRowOrColumnCount(this.height.value, this.cellMargin, this.cellSize);
    this.numCols = calculateRowOrColumnCount(this.width.value, this.cellMargin, this.cellSize);
  }

  private resizeGrid(): number[][] {
    const [oldNumRows, oldNumCols] = [this.numRows, this.numCols];
    this.updateDimensions();
    return resizeGrid(copyGrid(this.grid.value), oldNumRows, this.numRows, oldNumCols, this.numCols);
  }
}

const copyGrid = (grid: number[][]): number[][] => grid.map((row: number[]) => [...row]);

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

const getNextGenerationGrid = (grid: number[][]): number[][] => {
  const rowCount = grid.length;
  const colCount = grid[0].length;
  const nextGrid: number[][] = [];
  for (let row = 0; row < rowCount; row++) {
    const rowArray: number[] = [];
    for (let col = 0; col < colCount; col++) {
      const numberOfLiveNeighbors = countNeighbors(grid, row, col, rowCount, colCount);
      const isLive = [numberOfLiveNeighbors, numberOfLiveNeighbors + grid[row][col]].includes(3) ? 1 : 0;
      rowArray.push(isLive);
    }
    nextGrid.push(rowArray);
  }
  console.log('tock');
  return nextGrid;
};

const postitionsToCheck = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const countNeighbors = (grid, row, col, rowCount, colCount): number => {
  let count = 0;
  for (const position of postitionsToCheck) {
    const [rowOffset, colOffset] = position;
    const periodicBoundaryRow = (rowCount + row + rowOffset) % rowCount;
    const periodicBoundaryCol = (colCount + col + colOffset) % colCount;
    count += grid[periodicBoundaryRow][periodicBoundaryCol];
  }
  return count;
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
