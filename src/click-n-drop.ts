const clickNDrop = (col:any, player:string, gameState: boolean) => {
  if (col.querySelectorAll('span').length === 6 && !gameState) {
    return false;
  }
  const token: HTMLElement = document.createElement('span');
  token.setAttribute('class', `flc-game-piece ${player}`);
  col.prepend(token);
};

export default clickNDrop;
