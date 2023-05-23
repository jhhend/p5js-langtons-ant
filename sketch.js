
// Classes

class Ant {

  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.movements = {
      left : (y, x) => [ y, (x - 1 + CELL_COUNT) % CELL_COUNT ],
      right : (y, x) => [ y, (x + + 1 + CELL_COUNT) % CELL_COUNT ],
      up : (y, x) => [ (y - 1 + CELL_COUNT) % CELL_COUNT, x ],
      down : (y, x) => [ (y + 1 + CELL_COUNT) % CELL_COUNT, x ]
    }

    this.turns = {
      R : { left : 'up', right : 'down', up : 'right', down : 'left' },
      L : { left : 'down', right : 'up', up : 'left', down : 'right' }
    };
  }

  advance() {
    // Turn based on the current state
    //this.turn(rules[grid[this.y][this.x]]);
    this.turn(rules[grid.get(this.y, this.x)]);

    // Update the cell of the current state
    
    const currentValue = grid.get(this.y, this.x)//[this.y][this.x];
    /*
    if (currentValue + 1 !== stateCount) {
      grid[this.y][this.x] = currentValue + 1;
    } else {
      grid[this.y][this.x] = 0;
    }
    */
    if (currentValue + 1 !== stateCount) {
      grid.set(this.y, this.x, currentValue + 1);
      //grid[this.y][this.x] = currentValue + 1;
    } else {
      grid.set(this.y, this.x, 0);
      //grid[this.y][this.x] = 0;
    }

    // Move to the new cell
    [ this.y, this.x ] = this.movements[this.dir](this.y, this.x);
  }

  turn(turnDirection) {
    this.dir = this.turns[turnDirection][this.dir];
  }
}

class Grid {
  constructor(size) {
    this.size = size;
    this.grid = new Array(this.size).fill(0).map(v => new Array(this.size).fill(0));
  }

  clear() {
    this.grid = this.grid.map(row => row.map(col => 0));
  }

  set(y, x, value) {
    this.grid[y][x] = value;
  }

  get(y, x) {
    return this.grid[y][x];
  }

  draw() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col  ++) {
        let value = this.grid[row][col];

        fill(COLORS[value]);
        rect(col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }     
  }

}




// Global Constants

const CANVAS_SIZE = 720;
const CELL_SIZE = 4;
const CELL_COUNT = CANVAS_SIZE/CELL_SIZE;
 // Colors were really chosen with no reason behind the ordering...
const COLORS = [ 'black', 'green', 'purple', 'red',
  'aqua', 'orange', 'blue', 'silver',
  'navy', 'yellow', 'lime', 'teal',
  'fuchsia', 'maroon', 'lime', 'white' ];
const State = {
  Setup : 0,
  Run : 1
};





// Global Variables

let rules = 'RL';
let stateCount = rules.length;
let grid = new Grid(CELL_COUNT);
let ant = new Ant(Math.floor(CELL_COUNT/2), Math.floor(CELL_COUNT/2), 'left');
let iter = 0;
let iterationsPerFrame = 1;
let state = State.Setup;





// p5.js functions

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  noStroke();

  state = State.Run;

  createP("Rule:")
  ruleInput = createInput(rules);

  createP("Iterations per Frame:");
  speedSelect = createSelect();
  speedSelect.option('1');
  speedSelect.option('10');
  speedSelect.option('100');
  speedSelect.option('1000')
  speedSelect.selected('1');
  speedSelect.changed(() => {
    iterationsPerFrame = parseInt(speedSelect.value());
  });

  rerunButton = createButton('Rerun');
  rerunButton.mousePressed(() => {
    let regex = new RegExp('^(R|L)+$', 'i');
    let newRule = ruleInput.value();

    state = State.Setup;

    if (regex.test(newRule) && newRule.length <= 16) {
      rules = newRule.toUpperCase();
      stateCount = rules.length;
    } else {
      rules = 'RL';
      stateCount = 2;
    }
    ruleInput.value(rules.toUpperCase());

    grid.clear();
    iter = 0;

    ant.x = Math.floor(CELL_COUNT/2);
    ant.y = Math.floor(CELL_COUNT/2);
    ant.dir = 'left';
    state = State.Run;
  });
}

function draw() {
  background(220);

  if (state === State.Run) {
    for (let i = 0; i < iterationsPerFrame; i++) {
      if (state !== State.Run) {
        break;
      }
      ant.advance();
      iter++
    }
  }
  
  fill('white');
  rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  grid.draw();
}
