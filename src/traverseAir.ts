import checkForWinner from './checkForWinner';

const traverseAir = (currentArray: [], winCount = 4) => {
  return new Promise((resolve, reject) => {
    if (currentArray.length > 3 && checkForWinner(currentArray, winCount)) {
      resolve({ arrayContext: currentArray.reverse().slice(0, winCount) });
    } else {
      reject('left');
    }
  });
};

export default traverseAir;
