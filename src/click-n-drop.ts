const clickNDrop = (col:any, player:string, yourTurn: boolean) => {
  if (col.querySelectorAll('span').length === 6 && !yourTurn) {
    return false;
  }
  const token: HTMLElement = document.createElement('span');
  token.setAttribute('class', `flc-game-piece ${player}`);
  col.prepend(token);
  return true;
};

export default clickNDrop;
