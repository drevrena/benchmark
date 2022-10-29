const { runJimp, runImageMagick, runGm, runSharp, runImageScript } = require("./imagelibs.js");
const { arrayAverage, quantile } = require("./statistic.js");

const measures = [];

async function main() {
  const data = [];
  for (let i = 0; i < 25; i++) {
    data.push(await runBench());
  }

  measures.push({
    lib: "jimp",
    Avg:
      (arrayAverage(data.map((item) => item.jimp)) / 1000.0).toFixed(3) + "s",
    Median:
      (
        quantile(
          data.map((item) => item.jimp),
          0.5
        ) / 1000.0
      ).toFixed(3) + "s",
    Max: (Math.max(...data.map((item) => item.jimp)) / 1000.0).toFixed(3) + "s",
    Min: (Math.min(...data.map((item) => item.jimp)) / 1000.0).toFixed(3) + "s",
    p95:
      (
        quantile(
          data.map((item) => item.jimp),
          0.95
        ) / 1000.0
      ).toFixed(3) + "s",
  });

  measures.push({
    lib: "imagemagick",
    Avg:
      (arrayAverage(data.map((item) => item.imagemagick)) / 1000.0).toFixed(3) +
      "s",
    Median:
      (
        quantile(
          data.map((item) => item.imagemagick),
          0.5
        ) / 1000.0
      ).toFixed(3) + "s",
    Max:
      (Math.max(...data.map((item) => item.imagemagick)) / 1000.0).toFixed(3) +
      "s",
    Min:
      (Math.min(...data.map((item) => item.imagemagick)) / 1000.0).toFixed(3) +
      "s",
    p95:
      (
        quantile(
          data.map((item) => item.imagemagick),
          0.95
        ) / 1000.0
      ).toFixed(3) + "s",
  });

  measures.push({
    lib: "gm",
    Avg: (arrayAverage(data.map((item) => item.gm)) / 1000.0).toFixed(3) + "s",
    Median:
      (
        quantile(
          data.map((item) => item.gm),
          0.5
        ) / 1000.0
      ).toFixed(3) + "s",
    Max: (Math.max(...data.map((item) => item.gm)) / 1000.0).toFixed(3) + "s",
    Min: (Math.min(...data.map((item) => item.gm)) / 1000.0).toFixed(3) + "s",
    p95:
      (
        quantile(
          data.map((item) => item.gm),
          0.95
        ) / 1000.0
      ).toFixed(3) + "s",
  });

  measures.push({
    lib: "sharp",
    Avg:
      (arrayAverage(data.map((item) => item.sharp)) / 1000.0).toFixed(3) + "s",
    Median:
      (
        quantile(
          data.map((item) => item.sharp),
          0.5
        ) / 1000.0
      ).toFixed(3) + "s",
    Max:
      (Math.max(...data.map((item) => item.sharp)) / 1000.0).toFixed(3) + "s",
    Min:
      (Math.min(...data.map((item) => item.sharp)) / 1000.0).toFixed(3) + "s",
    p95:
      (
        quantile(
          data.map((item) => item.sharp),
          0.95
        ) / 1000.0
      ).toFixed(3) + "s",
  });

  
  measures.push({
    lib: "imagescript",
    Avg:
      (arrayAverage(data.map((item) => item.imagescript)) / 1000.0).toFixed(3) + "s",
    Median:
      (
        quantile(
          data.map((item) => item.imagescript),
          0.5
        ) / 1000.0
      ).toFixed(3) + "s",
    Max:
      (Math.max(...data.map((item) => item.imagescript)) / 1000.0).toFixed(3) + "s",
    Min:
      (Math.min(...data.map((item) => item.imagescript)) / 1000.0).toFixed(3) + "s",
    p95:
      (
        quantile(
          data.map((item) => item.imagescript),
          0.95
        ) / 1000.0
      ).toFixed(3) + "s",
  });

  console.table(measures);
}

main();

async function runBench() {
  //clear old marks
  performance.clearMarks();
  performance.mark("Jimp-start");
  await runJimp();
  performance.mark("Jimp-end");

  performance.mark("ImageMagick-start");
  await runImageMagick();
  performance.mark("ImageMagick-end");

  performance.mark("gm-start");
  await runGm();
  performance.mark("gm-end");

  performance.mark("sharp-start");
  await runSharp();
  performance.mark("sharp-end");
  
  performance.mark("imagescript-start");
  await runImageScript();
  performance.mark("imagescript-end");

  return {
    jimp: performance.measure("Jimp", "Jimp-start", "Jimp-end").duration,
    imagemagick: performance.measure(
      "imagemagick",
      "ImageMagick-start",
      "ImageMagick-end"
    ).duration,
    gm: performance.measure("gm", "gm-start", "gm-end").duration,
    sharp: performance.measure("sharp", "sharp-start", "sharp-end").duration,
    imagescript: performance.measure("imagescript", "imagescript-start", "imagescript-end").duration
  };
}

Number.prototype.toFixed = function (digits) {
  var step = Math.pow(10, digits || 0);
  var temp = Math.trunc(step * this);

  return temp / step;
};
