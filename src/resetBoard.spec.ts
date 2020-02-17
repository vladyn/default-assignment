import resetBoard from './resetBoard';

let before;
let after;

describe('Resenting game board after a winner or draw move', () => {
  beforeEach(() => {
    before = `
    <span id="hostPlayerAvatar" class="flc-game-avatar player-one winner"></span>
    <span id="guestPlayerAvatar" class="flc-game-avatar player-two winner"></span>
            <div class="board-col">
              <span class="flc-game-piece player-two"></span>
            </div>
            <div class="board-col">
              <span class="flc-game-piece player-one"></span>
              <span class="flc-game-piece player-two"></span>
              <span class="flc-game-piece player-one"></span>
            </div>
            <div class="board-col">
              <span class="flc-game-piece player-two"></span>
              <span class="flc-game-piece player-one"></span>
            </div>
            <div class="board-col">
              <span class="flc-game-piece player-one"></span>
              <span class="flc-game-piece player-one"></span>
            </div>
    `;
    after = `
    <span id="hostPlayerAvatar" class="flc-game-avatar player-one"></span>
    <span id="guestPlayerAvatar" class="flc-game-avatar player-two"></span>
            <div class="board-col"></div>
            <div class="board-col"></div>
            <div class="board-col"></div>
            <div class="board-col"></div>
    `;
    document.body.innerHTML = before;
  });
  it('should return a clean board', () => {
    resetBoard();
    expect(document.body.innerHTML).toEqual(after);
  });
});
