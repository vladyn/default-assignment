import turnService from './turnService';

describe('Turn service', () => {
  const turn = jest.fn()
    .mockReturnValueOnce('player-one')
    .mockReturnValueOnce('player-two');
  beforeEach(() => {
    window.location.assign = jest.fn();
  });
  it('should call the turn service', () => {
    turnService();
    expect(turnService()).toEqual('player-one');
  });
  it('should check the times return service is called', () => {
    turn();
    expect(turn.mock.calls.length).toBe(1);
    turn();
    expect(turn.mock.calls.length).toBe(2);
  });
  it('should return the opponent player: player-one', () => {
    turn();
    expect(turn.mock.results[0].value).toBe('player-one');
  });
  it('should return the opponent player: player-two', () => {
    turn();
    expect(turn.mock.results[1].value).toBe('player-two');
  });
});
