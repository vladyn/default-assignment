import { hostPlayerRole as player } from './index';
let playerMove = player;

const turnService = (): string => {
  return playerMove = playerMove === 'player-two' ? 'player-one' : 'player-two';
};

export default turnService;
