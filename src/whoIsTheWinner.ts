import pronounceWinner from './pronounceWinner';
import traverseAir from './traverseAir';
const drops: Object = {};
let counter: number;
const cols = document.querySelectorAll('div.board-col');
const winnerLength = 4;
const winners: HTMLSpanElement[] = [];

function whoIsTheWinner(player: string, index: number): void {
  const currentStack = drops['col' + index] = drops['col' + index] || [];
  counter = 1;
  currentStack.push(player);

  traverseAir(currentStack, winnerLength)
      .then(() => {
        const currElement = cols[index].querySelector('span');
        const winners: any = Array.from(cols[index].querySelectorAll('span'));
        pronounceWinner(currElement, winners.slice(0, winnerLength));
      })
      .catch(() => {
        traverseScorpions(currentStack, index)
            .then(() => traverseSnakes(currentStack, index),
              () => {
                const currElement = cols[index].querySelector('span');
                pronounceWinner(currElement, winners.slice(0, winnerLength));
              })
            .then(() => {
              counter = 1;
              winners.length = 0;
              return traverseBullLeft(currentStack, index);
            }, () => {
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
            })
            .then(() => traverseBullRight(currentStack, index), () => {
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
            })
            .then(() => {
              counter = 1;
              winners.length = 0;
              return traverseBearLeft(currentStack, index);
            }, () => {
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
              console.log(winners);
            })
            .then(() => traverseBearRight(currentStack, index), () => {
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
            })
            .then(() => {
              counter = 1;
              winners.length = 0;
            }, () => {
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
              counter = 1;
              winners.length = 0;
            });
      });
}
export default whoIsTheWinner;

const traverseBears = (currentArray: [], index: number, direction: 'left' | 'right') => {
  return new Promise((resolve, reject) => {
    let i = index;
    let nextArray;
    let nextArrEl;
    let d: number = direction === 'left' ? -1 : 1;
    let c: number = Math.abs(d);
    let nextElSameLevel: number;
    const currEl = [...currentArray].pop();
    const currHtmlEl: HTMLSpanElement = cols[i].querySelector('span');
    let elToPush: HTMLSpanElement;
    if (winners.length === 0) winners.push(currHtmlEl);
    while (direction === 'left' ? i >= 0 : i <= 6) {
      const j = direction === 'left' ? i - 1 : i + 1;
      d++;
      nextArray = drops['col' + j] || [];
      nextArray = drops['col' + j] || [];
      nextArrEl = direction === 'left'
      ?
        nextArrEl = nextArray[currentArray.length + d]
      :
        nextArrEl = nextArray[currentArray.length - d];

      if ('col' + j in drops && currEl === nextArrEl) {
        counter++;
        nextElSameLevel = nextArray.length - currentArray.length;
        if (direction === 'left' && nextArray.length > currentArray.length) {
          elToPush = cols[j].querySelectorAll('span')[nextElSameLevel - c];
          elToPush.className === currHtmlEl.className ? winners.push(elToPush) : null;
        }
        if (direction === 'right' && nextArray.length >= 1) {
          elToPush = cols[j].querySelectorAll('span')[nextElSameLevel + c];
          elToPush.className === currHtmlEl.className ? winners.push(elToPush) : null;
        }
        c++;
        if (counter === winnerLength) {
          reject(`We have a winner on ${direction} of Bears with a ${counter}`);
          break;
        }
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
    }
  });
};

const traverseBulls = (currentArray: [], index: number, direction: 'left' | 'right') => {
  return new Promise((resolve, reject) => {
    let i: number = index;
    let nextArray: [];
    let nextElClassName: string;
    let d: number = direction === 'left' ? 1 : -1;
    let c: number = Math.abs(d);
    let elToPush: HTMLSpanElement;
    let nextElSameLevel: number;
    const currEl: string = [...currentArray].pop();
    const currHtmlEl: HTMLSpanElement = cols[i].querySelector('span');
    if (winners.length === 0) winners.push(currHtmlEl);
    while (direction === 'left' ? i >= 0 : i <= 6) {
      const j = direction === 'left' ? i - 1 : i + 1;
      nextArray = drops['col' + j] || [];
      d++;
      nextElClassName = direction === 'left'
          ?
          nextElClassName = nextArray[currentArray.length - d]
          :
          nextElClassName = nextArray[currentArray.length + d];

      if ('col' + j in drops && nextElClassName === currEl) {
        counter++;
        nextElSameLevel = nextArray.length - currentArray.length;
        if (direction === 'left' && nextArray.length >= 1) {
          elToPush = cols[j].querySelectorAll('span')[nextElSameLevel + c];
          elToPush.className === currHtmlEl.className ? winners.push(elToPush) : null;
        }
        if (direction === 'right' && nextArray.length >= currentArray.length) {
          elToPush = cols[j].querySelectorAll('span')[nextElSameLevel - c];
          elToPush.className === currHtmlEl.className ? winners.push(elToPush) : null;
        }
        c++;
        if (counter === winnerLength) {
          reject(`We have a winner on ${direction} of Bulls with a ${counter}`);
          break;
        }
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
    }
  });
};

const traverseEarth = (currentArray: [], index: number, direction: 'left' | 'right') => {
  return new Promise((resolve, reject) => {
    let i = index;
    let nextArray;
    let nextArrEl;
    const currEl = [...currentArray].pop();
    const currHtmlEl = cols[i].querySelectorAll('span')[0];
    if (winners.length === 0) winners.push(currHtmlEl);
    while (direction === 'left' ? i >= 0 : i <= 6) {
      const j = direction === 'left' ? i - 1 : i + 1;
      nextArray = drops['col' + j] || [];
      nextArrEl = nextArray[currentArray.length - 1];
      if ('col' + j in drops && nextArray.length >= currentArray.length && currEl === nextArrEl) {
        counter++;
        const index: number = Math.abs(nextArray.length - currentArray.length);
        const elToPush = cols[j].querySelectorAll('span')[index];
        if (nextArray.length > 0 && elToPush.className === currHtmlEl.className) {
          winners.push(elToPush);
        }
        if (counter === winnerLength) {
          reject(`We have a winner on ${direction} with a ${counter}`);
          break;
        }
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
    }
  });
};

const traverseScorpions = (currentArray: [], index: number) => {
  return traverseEarth(currentArray, index, 'left');
};

const traverseSnakes = (currentArray: [], index: number) => {
  return traverseEarth(currentArray, index, 'right');
};

const traverseBullLeft = (currentArray: [], index: number) => {
  return traverseBulls(currentArray, index, 'left');
};
const traverseBullRight = (currentArray: [], index: number) => {
  return traverseBulls(currentArray, index, 'right');
};

const traverseBearLeft = (currentArray: [], index: number) => {
  return traverseBears(currentArray, index, 'left');
};
const traverseBearRight = (currentArray: [], index: number) => {
  return traverseBears(currentArray, index, 'right');
};
