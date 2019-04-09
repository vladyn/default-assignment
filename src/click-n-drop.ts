const clickNDrop = (col:any, player:string, yourTurn?: boolean) => {
  if (col.querySelectorAll('span').length === 6 && yourTurn !== true) {
    console.info(`Either tokens are 6 OR it's not your turn: ${yourTurn}`);
    return false;
  }
  const token: HTMLElement = document.createElement('span');
  token.setAttribute('class', `flc-game-piece ${player}`);
  col.prepend(token);
  return true;
};

export default clickNDrop;
