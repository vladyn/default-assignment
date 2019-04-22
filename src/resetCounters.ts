const resetCounters = (): {drops, counter, winners} => {
  const d: [] = [];
  const drops = {};
  const c = 1;
  return {
    drops,
    counter: c,
    winners: d
  };
};

export default resetCounters;
