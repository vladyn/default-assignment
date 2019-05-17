import clickAndDrop from './clickAndDrop';

let col: HTMLElement;
let player: string = 'player-two';
let yourTurn: boolean = true;
const span: HTMLSpanElement = document.createElement('span');
span.classList.add('flc-game-piece');

describe('service creates and appends an element to the board on Click', () => {
  beforeAll(() => {
    col = document.createElement('div');
    col.classList.add('board-col');
    player = 'player-one';
  });
  beforeEach(() => {
    col.innerHTML = '';
  });
  it('should create and add a token to the board', () => {
    clickAndDrop(col, player, yourTurn);
    expect(col.innerHTML).toEqual('<span class="flc-game-piece player-one"></span>');
  });
  it('should prepend second token to the board', () => {
    clickAndDrop(col, player, yourTurn);
    clickAndDrop(col, player, yourTurn);
    expect(col.innerHTML)
      .toEqual('<span class="flc-game-piece player-one"></span><span class="flc-game-piece player-one"></span>');
  });
  it('should prepend third token with a different player name to the board', () => {
    player = 'player-two';
    clickAndDrop(col, player, yourTurn);
    expect(col.innerHTML)
      .toEqual('<span class="flc-game-piece player-two"></span>');
  });
  it('should not prepend more than six tokens to the board', () => {
    yourTurn = false;
    const spans = [];
    const spanNum = 5;
    for (let i = 0; i <= spanNum; i++) {
      spans[i] = span.cloneNode(true);
    }
    spans.forEach((span) => {
      span.classList.add(player);
      col.prepend(span);
    });
    clickAndDrop(col, player, yourTurn);
    expect(col.innerHTML)
      .toEqual('<span class="flc-game-piece player-two"></span><span class="flc-game-piece player-two"></span><span class="flc-game-piece player-two"></span><span class="flc-game-piece player-two"></span><span class="flc-game-piece player-two"></span><span class="flc-game-piece player-two"></span>');
  });
  it('should not prepend a token to the board when it\'s not your turn', () => {
    yourTurn = false;
    clickAndDrop(col, player, yourTurn);
    expect(col.innerHTML)
      .toEqual('<span class="flc-game-piece player-two"></span>');
  });
});
