let playerMove = 'player-two';

const turnService = () => playerMove = playerMove === 'player-two' ? 'player-one' : 'player-two';

export default turnService;
