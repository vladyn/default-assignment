import resetCounters from './resetCounters';

const drops: {} = {
  col1: ['player-one', 'player-one', 'player-one'],
  col2: ['player-one', 'player-one', 'player-one'],
  col3: ['player-one', 'player-one', 'player-one'],
  col4: ['player-one', 'player-one', 'player-one']
};
const counter: number = 4;
const winners: string[] = ['player-one', 'player-one', 'player-one'];
let counters: {} = { drops, counter, winners };
const resetValues = { drops: {}, counter: 1, winners: [] };

describe('Reset game counters', () => {
  it('shouldn\'t touch the counters', () => {
    expect(counters).not.toEqual(resetValues);
  });
  it('should reset given counters', () => {
    counters = resetCounters();
    expect(counters).toStrictEqual(resetValues);
  });
});
