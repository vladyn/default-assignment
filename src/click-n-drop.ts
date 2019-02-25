const clickNDrop = (col:any, player:string) => {
  if (col.querySelectorAll('span').length === 6) {
    return false;
  }
  const token:HTMLElement = document.createElement('span');
  token.setAttribute('class', `flc-game-piece ${player}`);
  col.prepend(token);
};

export default clickNDrop;
