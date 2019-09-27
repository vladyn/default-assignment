import traverseAir from './traverseAir';

let winnerArray;

beforeEach(() => {
  winnerArray = [
    'player-one',
    'player-one',
    'player-one',
    'player-one'
  ];
});

describe('Check the array length and returns boolean', () => {
  it('should resolve a winner with context object', () => {
    return traverseAir(winnerArray)
      .then((res) => {
        expect(res).toBeInstanceOf(Object);
        const contextArray = ['player-one', 'player-one', 'player-one', 'player-one'];
        expect(res).toEqual({ arrayContext: contextArray });
      });
  });
  it('should reject with a direction for the next traverse', () => {
    winnerArray.unshift('player-FAILED');
    return traverseAir(winnerArray)
      .catch((res) => {
        expect(res).toBeInstanceOf(String);
        expect(res).toBe('left');
      });
  });
});
