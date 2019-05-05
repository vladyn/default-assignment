const resetCounters = (): {drops, counter, winners} => {
  const d: [] = [];
  const drops: {} = {};
  const c: number = 1;
  return {
    drops,
    counter: c,
    winners: d
  };
};

export default resetCounters;
