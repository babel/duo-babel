
module.exports = function sum(...args) {
  return args.reduce((acc, x) => acc + x, 0);
};
