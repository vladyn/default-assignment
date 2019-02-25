const drops: Object = {};
let counter: number = 1;

function whoIsTheWinner(player: string, index: number) {
  const currentStack = drops['col' + index] = drops['col' + index] || [];
  counter = 1;
  // Fill the Array with span from selected column
  currentStack.push(player);

  // TODO: use arrow function's return statement from one row feature
  traverseVertical(currentStack)
      .then(result => console.info(`%c ${result}`, 'background: #222; color: #bada55'))
      .catch((result) => {
        console.log(`traverse vertical reject with: ${result}`);
        traverseHorizontalBackward(currentStack, index)
            .then((result) => {
              console.info(`%c ${result} within direction left`,
                  'background: #222; color: #bada55; padding: 2px');
              return traverseHorizontalForward(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within direction right`,
                  'background: #222; color: #bada55; padding: 2px');
              counter = 1;

              return traverseBullLeft(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within Bulls left`,
                  'background: #222; color: #bada55; padding: 2px');
              return traverseBullRight(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within Bulls right`,
                  'background: #222; color: #bada55; padding: 2px');
              counter = 1;
              return traverseBearLeft(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within Bear left`,
                  'background: #222; color: #bada55; padding: 2px');
              return traverseBearRight(currentStack, index);
            })
            .then((result) => {
              console.info(`%c ${result} within Bear right`,
                  'background: #222; color: #bada55; padding: 2px');
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
        nextArrEl = nextArray[currentArray.length + d]
      :
        nextArrEl = nextArray[currentArray.length - d];

      console.log(`Bear ${direction}: condition prev Element === currEll: ${nextArrEl === currEl}`);
      console.log(`Bear ${direction}: nextArrEl: ${nextArrEl}`);
      console.log(`Bear ${direction}: currEll: ${currEl}`);
      console.log(`BearCurrent array length is: ${currentArray.length}`);
      console.log(`Bear Next array length is: ${nextArray.length}`);
      if ('col' + j in drops && currEl === nextArrEl) {
        counter++;
        console.log(`Bear ${direction}: current array is ${currEl}`);
        console.log('Bear ${direction}: incrementing counter from BullLeft traverse');
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
      console.log(`counter after Bear ${direction} is ${counter}`);
      console.table(drops);
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

      console.log(`Bull ${direction}: condition prev Element === currEll: ${nextArrEl === currEl}`);
      console.log(`Bull ${direction}: prevArrEl: ${nextArrEl}`);
      console.log(`Bull ${direction}: currEll: ${currEl}`);
      console.log(`BCurrent array length is: ${currentArray.length}`);
      console.log(`B Next array length is: ${nextArray.length}`);
      if ('col' + j in drops && nextArrEl === currEl) {
        counter++;
        console.log(`Bull ${direction}: current array is ${currEl}`);
        console.log('Bull ${direction}: incrementing counter from BullLeft traverse');
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
      console.log(`counter after Bull ${direction} is ${counter}`);
      console.table(drops);
    }
  });
};

const traverseVertical = (currentArray) => {
  // Check the verticals in the same array
  return new Promise((resolve, reject) => {
    if (currentArray.length > 3 && checkForWinner(currentArray, 4)) {
      resolve('We have a winner on the vertical!');
    } else {
      reject('left');
    }
  });
};

// TODO: try to refactor this and combine it with the Forward traverse
const traverseHorizontalBackward = (currentArray: [], index: number) => {
  return traverseOceans(currentArray, index, 'left');
};

// TODO: try to refactor this and combine it with the Backward traverse
const traverseHorizontalForward = (currentArray: [], index: number) => {
  return traverseOceans(currentArray, index, 'right');
};

const traverseOceans = (currentArray: [], index: number, direction: 'left' | 'right') => {
  return new Promise((resolve, reject) => {
    let i = index;
    let nextArray;
    let nextArrEl;
    const currEl = [...currentArray].pop();
    while (direction === 'left' ? i >= 0 : i <= 6) {
      const j = direction === 'left' ? i - 1 : i + 1;
      nextArray = drops['col' + j] || [];
      nextArrEl = nextArray[currentArray.length - 1];
      console.log(`J is ${j}`);
      console.log(`Horizontals ${direction}: currEll === nextArrEl: ${nextArrEl === currEl}`);
      console.log(`Horizontals ${direction}: prevArrEl: ${nextArrEl}`);
      console.log(`Horizontals ${direction}: currEll: ${currEl}`);
      console.log(`Horizontals ${direction}: INDEX is: ${index}`);
      console.log(`Horizontals Current array length is: ${currentArray.length}`);
      console.log(`Horizontals Next array length is: ${nextArray.length}`);
      if ('col' + j in drops && nextArray.length >= currentArray.length && currEl === nextArrEl) {
        counter++;
        console.log(`Horizontals ${direction}: current array is ${currEl}`);
        console.log(`Horizontals ${direction}: incrementing counter from Horizontal traverse`);
      } else {
        resolve(counter);
        break;
      }
      direction === 'left' ? i-- : i++;
      console.log(`counter after Horizontals ${direction} is ${counter}`);
      console.table(drops);
    }
  });
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
