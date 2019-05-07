const clickAndDrop = (col: HTMLElement | Element, player: string, yourTurn?: boolean):
  HTMLElement | Element | boolean => {
  if (col.querySelectorAll('span').length === 6 && yourTurn !== true) return false;
  const token: HTMLElement = document.createElement('span');
  token.setAttribute('class', `flc-game-piece ${player}`);
  col.prepend(token);
  return col;
};

export default clickAndDrop;
