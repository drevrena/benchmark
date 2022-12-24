const { runJimp, runImageMagick, runGm, runSharp, runImageScript } = require("./imagelibs.js");
const { arrayAverage, quantile } = require("./statistic.js");

const measures = [];
const libs = ["jimp","imagemagick","gm","sharp","imagescript"]

async function main() {
  const data = [];
  for (let i = 0; i < 25; i++) {
    data.push(await runBench());
  }

  for (const lib of libs) {
    measures.push({
      lib: lib,
      Avg: (arrayAverage(data.map((item) => item[lib])) / 1000.0).toFixed(3) + "s",
      Median: (quantile(data.map((item) => item[lib]), 0.5) / 1000.0).toFixed(3) + "s",
      Max: (Math.max(...data.map((item) => item[lib])) / 1000.0).toFixed(3) + "s",
      Min: (Math.min(...data.map((item) => item[lib])) / 1000.0).toFixed(3) + "s",
      p95: (quantile( data.map((item) => item[lib]), 0.95) / 1000.0).toFixed(3) + "s",
    });
  }

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
    imagemagick: performance.measure("imagemagick","ImageMagick-start","ImageMagick-end").duration,
    gm: performance.measure("gm", "gm-start", "gm-end").duration,
    sharp: performance.measure("sharp", "sharp-start", "sharp-end").duration,
    imagescript: performance.measure("imagescript", "imagescript-start", "imagescript-end").duration
  };
}
