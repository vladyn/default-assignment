import pronounceWinner from './pronounceWinner';
const drops: Object = {};
let counter: number = 1;
const cols = document.querySelectorAll('div.board-col');
const winnerLength = 4;
const winners: HTMLSpanElement[] = [];

function whoIsTheWinner(player: string, index: number): void {
  const currentStack = drops['col' + index] = drops['col' + index] || [];
  counter = 1;

  // Fill the Array with span from selected column
  currentStack.push(player);

  traverseAir(currentStack)
      .then((result) => {
        const currElement = cols[index].querySelector('span');
        const winners: any = Array.from(cols[index].querySelectorAll('span'));
        console.log(result);
        pronounceWinner(currElement, winners.slice(0, winnerLength));
      })
      .catch((result) => {
        console.log(`traverse vertical reject with: ${result}`);
        traverseScorpions(currentStack, index)
            .then((result) => {
              console.info(`%c ${result} within direction left 🦂`,
                  'background: #222; color: #bada55; padding: 2px');
              return traverseSnakes(currentStack, index);
            }, (winner) => {
              console.log(`%c ${winner} Scorpions 🦂 WIN`,
                'background: #126349; color: #bada55; padding: 2px; font-size: 16px');
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
            })
            .then((result) => {
              console.info(`%c ${result} within direction right 🐍`,
                  'background: #222; color: #bada55; padding: 2px');
              counter = 1;
              winners.length = 0;
              return traverseBullLeft(currentStack, index);
            }, (winner) => {
              console.log(`%c ${winner} Snakes 🐍 WIN`,
                'background: #126349; color: #bada55; padding: 2px; font-size: 16px');
              const currElement = cols[index].querySelector('span');
              pronounceWinner(currElement, winners.slice(0, winnerLength));
            })
            .then((result) => {
              console.info(`%c ${result} within 🐂 Bulls left`,
                  'background: #222; color: #bada55; padding: 2px');
              return traverseBullRight(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within 🐂 Bulls right`,
                  'background: #222; color: #bada55; padding: 2px');
              counter = 1;
              winners.length = 0;
              return traverseBearLeft(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within 🐻 Bear left`,
                  'background: #cc6a74; color: #faf6e1; padding: 2px');
              return traverseBearRight(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within 🐻 Bear right`,
                  'background: #cc6a74; color: #faf6e1; padding: 2px');
            });
      });
}
export default whoIsTheWinner;

const checkForWinner = (array, length: number = 4) => {
  let count = 0;
  let value = array[0];
  return array.some((item) => {
    if (value !== item) {
      count = 0;
      value = item;
    }
    return ++count === length;
  });
};

const traverseBears = (currentArray: [], index: number, direction: 'left' | 'right') => {
  return new Promise((resolve) => {
    let i = index;
    let nextArray;
    let nextArrEl;
    let d = direction === 'left' ? -1 : 1;
    const currEl = [...currentArray].pop();
    while (direction === 'left' ? i >= 0 : i <= 6) {
      console.log(`i is ${i}`);
      const j = direction === 'left' ? i - 1 : i + 1;
      console.log(`j is ${j}`);
      d++;
      console.log(`d is ${d}`);
      nextArray = drops['col' + j] || [];
      nextArrEl = direction === 'left'
      ?
        nextArrEl = nextArray[currentArray.length + d]
      :
        nextArrEl = nextArray[currentArray.length - d];
      console.groupCollapsed(`Bears ${direction} details`);
      console.log(`Bear ${direction}: condition prev Element === currEll: ${nextArrEl === currEl}`);
      console.log(`Bear ${direction}: nextArrEl: ${nextArrEl}`);
      console.log(`Bear ${direction}: currEll: ${currEl}`);
      console.log(`BearCurrent array length is: ${currentArray.length}`);
      console.log(`Bear Next array length is: ${nextArray.length}`);
      console.groupEnd();
      if ('col' + j in drops && currEl === nextArrEl) {
        counter++;
        console.groupCollapsed(`Bears ${direction} details`);
        console.log(`Bear ${direction}: current array is ${currEl}`);
        console.log('Bear ${direction}: incrementing counter from BullLeft traverse');
        console.groupEnd();
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
      console.groupCollapsed(`Bears ${direction} details`);
      console.log(`counter after Bear ${direction} is ${counter}`);
      console.table(drops);
      console.groupEnd();
    }
  });
};

const traverseBulls = (currentArray: [], index: number, direction: 'left' | 'right') => {
  return new Promise((resolve) => {
    let i = index;
    let nextArray;
    let nextArrEl;
    let d = direction === 'left' ? 1 : -1;
    const currEl = [...currentArray].pop();
    while (direction === 'left' ? i >= 0 : i <= 6) {
      console.log(`i is ${i}`);
      const j = direction === 'left' ? i - 1 : i + 1;
      console.log(`j is ${j}`);
      d++;
      console.log(`d is ${d}`);
      nextArray = drops['col' + j] || [];
      nextArrEl = direction === 'left'
          ?
          nextArrEl = nextArray[currentArray.length - d]
          :
          nextArrEl = nextArray[currentArray.length + d];
      console.groupCollapsed(`Bulls ${direction} details`);
      console.log(`Bull ${direction}: condition prev Element === currEll: ${nextArrEl === currEl}`);
      console.log(`Bull ${direction}: prevArrEl: ${nextArrEl}`);
      console.log(`Bull ${direction}: currEll: ${currEl}`);
      console.log(`BCurrent array length is: ${currentArray.length}`);
      console.log(`B Next array length is: ${nextArray.length}`);
      console.groupEnd();
      if ('col' + j in drops && nextArrEl === currEl) {
        counter++;
        console.groupCollapsed(`Bulls ${direction} details`);
        console.log(`Bull ${direction}: current array is ${currEl}`);
        console.log('Bull ${direction}: incrementing counter from BullLeft traverse');
        console.groupEnd();
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
      console.groupCollapsed(`Bulls ${direction} details`);
      console.log(`counter after Bull ${direction} is ${counter}`);
      console.table(drops);
      console.groupEnd();
    }
  });
};

const traverseAir = (currentArray: []) => {
  // Check the verticals in the same array
  return new Promise((resolve, reject) => {
    if (currentArray.length > 3 && checkForWinner(currentArray, winnerLength)) {
      resolve({ arrayContext: currentArray.reverse().slice(0, winnerLength) });
    } else {
      reject('left');
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
    winners.length === 0 ? winners.push(currHtmlEl) : console.log(winners);
    while (direction === 'left' ? i >= 0 : i <= 6) {
      const j = direction === 'left' ? i - 1 : i + 1;
      nextArray = drops['col' + j] || [];
      nextArrEl = nextArray[currentArray.length - 1];
      console.groupCollapsed(`Earth ${direction === 'left' ? 'scorpions' : 'snakes'} details`);
      console.log(`J is ${j}`);
      console.log(`Horizontals ${direction}: currEll === nextArrEl: ${nextArrEl === currEl}`);
      console.log(`Horizontals ${direction}: prevArrEl: ${nextArrEl}`);
      console.log(`Horizontals ${direction}: currEll: ${currEl}`);
      console.log(`Horizontals column ${direction}: column${i}`);
      console.log(`Horizontals Current array length is: ${currentArray.length}`);
      console.log(`Horizontals Next array length is: ${nextArray.length}`);
      console.groupEnd();
      if ('col' + j in drops && nextArray.length >= currentArray.length && currEl === nextArrEl) {
        counter++;
        const index: number = Math.abs(nextArray.length - currentArray.length);
        const elToPush = cols[j].querySelectorAll('span')[index];
        if (nextArray.length > 0 && elToPush.className === currHtmlEl.className) {
          winners.push(elToPush);
        }
        console.log(winners);
        console.group(`NOMINATED ${direction === 'left' ? 'scorpions' : 'snakes'} details`);
        console.log(`J is ${j}`);
        console.log(`Horizontals ${direction}: next span: ${elToPush}`);
        console.log(`Horizontals ${direction}: currEll: ${currHtmlEl}`);
        console.log(`Horizontals ${direction}: INDEX is: ${i}`);
        console.log(`Horizontals Next array length is: ${cols[j].querySelectorAll('span').length}`);
        console.groupEnd();
        console.groupCollapsed(`Earth ${direction === 'left' ? 'scorpions' : 'snakes'} details`);
        console.log(`Horizontals ${direction}: current array is ${currEl}`);
        console.log(`Horizontals ${direction}: incrementing counter from Horizontal traverse`);
        console.groupEnd();
        if (counter === 4) {
          reject(`We have a winner on ${direction} with a ${counter}`);
          reject(`We have a winner on ${direction} with a ${counter}`);
          break;
        }
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
      console.groupCollapsed(`Earth ${direction === 'left' ? 'scorpions' : 'snakes'} details`);
      console.log(`counter after Horizontals ${direction} is ${counter}`);
      console.table(drops);
      console.groupEnd();
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
