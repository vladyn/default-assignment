const cols: NodeListOf<Element> = document.querySelectorAll('div.board-col');
const resetBoard = () => {
  cols.forEach((el: any) => {
    while (el.firstChild) {
      el.firstChild.remove();
    }
  });
};

export default resetBoard;
