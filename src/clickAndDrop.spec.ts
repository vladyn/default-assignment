import clickAndDrop from './clickAndDrop';

let col: HTMLElement;
let player: string = 'player-two';
let yourTurn: boolean = false;
let DOMBefore;
let DOMAfter;
let numberOfClones: number = 5;

describe('service creates and appends an element to the board on Click', () => {
  beforeAll(() => {
    col = document.createElement('div');
    col.classList.add('board-col');
    player = 'player-one';
    const cols = [];
    const colNum = 4;
    for (let i = 0; i <= colNum; i++) {
      cols[i] = col.cloneNode(true);
    }
    cols.forEach((col) => {
      const span: HTMLSpanElement = document.createElement('span');
      span.classList.add(player);
      col.prepend(span);
    });
  });
  it('should create and add a token to the board', () => {
    clickAndDrop(col, player, yourTurn);
    console.log(clickAndDrop(col, player, yourTurn));
  });
});
