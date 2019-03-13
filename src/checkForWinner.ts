const checkForWinner = (array, length: number = 1) => {
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

export default checkForWinner;
