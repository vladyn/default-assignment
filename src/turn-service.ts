/*
*  TODO: re-do the Turn Service so you'll be able to retain the current player
*   turn in a correct way.
* */
import { hostPlayerRole as player } from './index';
let playerMove = player;

const turnService = (): string => {
  return playerMove = playerMove === 'player-two' ? 'player-one' : 'player-two';
};

export default turnService;
