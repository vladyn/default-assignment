const cols: NodeListOf<Element> = document.querySelectorAll('div.board-col');
export function resetBoard() {
  cols.forEach((el: any) => {
    while (el.firstChild) {
      el.firstChild.remove();
    }
  });
}
