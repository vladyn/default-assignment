const clickAndDrop = (col: HTMLElement | Element, player: string, yourTurn: boolean):
  HTMLElement | Element => {
  if (col.querySelectorAll('span').length >= 6 || yourTurn !== true) {
    return col;
  }
  const token: HTMLElement = document.createElement('span');
  token.setAttribute('class', `flc-game-piece ${player}`);
  col.prepend(token);
  return col;
};

export default clickAndDrop;
