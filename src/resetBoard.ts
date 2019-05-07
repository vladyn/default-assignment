const resetBoard = () => {
  const cols: NodeListOf<Element> = document.querySelectorAll('div.board-col');
  const hostPlayerAvatar: HTMLSpanElement = document.getElementById('hostPlayerAvatar');
  const guestPlayerAvatar: HTMLSpanElement = document.getElementById('guestPlayerAvatar');
  const winnerClass: string = 'winner';
  cols.forEach((el: any) => {
    while (el.firstChild) {
      el.firstChild.remove();
    }
  });
  hostPlayerAvatar.classList.remove(winnerClass);
  guestPlayerAvatar.classList.remove(winnerClass);
};

export default resetBoard;
