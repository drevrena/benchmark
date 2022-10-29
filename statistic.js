//https://stackoverflow.com/questions/48719873/how-to-get-median-and-quartiles-percentiles-of-an-array-in-javascript-or-php
//adapted from https://blog.poettner.de/2011/06/09/simple-statistics-with-php/
function quantile(data, q) {
  data = arraySortNumbers(data);
  var pos = (data.length - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if (data[base + 1] !== undefined) {
    return data[base] + rest * (data[base + 1] - data[base]);
  } else {
    return data[base];
  }
}

function arraySortNumbers(inputarray) {
  return inputarray.sort(function (a, b) {
    return a - b;
  });
}

function arraySum(t) {
  return t.reduce(function (a, b) {
    return a + b;
  }, 0);
}

function arrayAverage(data) {
  return arraySum(data) / data.length;
}

module.exports = { arrayAverage, quantile };
