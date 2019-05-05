import resetCounters from './resetCounters';

const drops: {} = {
  col1: ['player-one', 'player-one', 'player-one'],
  col2: ['player-one', 'player-one', 'player-one'],
  col3: ['player-one', 'player-one', 'player-one'],
  col4: ['player-one', 'player-one', 'player-one']
};
const counter: number = 4;
const winners: string[] = ['player-one', 'player-one', 'player-one'];
let counters: {drops, counter, winners} = { drops, counter, winners };
const resetValues = { drops: {}, counter: 1, winners: [] };

describe('Reset game counters', () => {
  it('shouldn\'t change the counters without a call', () => {
    expect(counters).not.toEqual(resetValues);
    expect(counters.drops).toEqual(drops);
    expect(counters.counter).toBe(counter);
    expect(counters.winners).toEqual(winners);
  });
  it('should reset the given counters', () => {
    counters = resetCounters();
    expect(counters).toStrictEqual(resetValues);
  });
});
