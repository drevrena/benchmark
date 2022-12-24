import { resize } from "https://deno.land/x/deno_image/mod.ts";
import {ImageMagick,initializeImageMagick,MagickFormat,} from "https://raw.githubusercontent.com/leonelv/deno-imagemagick/master/mod.ts";
import { Image } from "https://deno.land/x/imagescript/mod.ts";
import { createRequire } from "https://deno.land/std/node/module.ts";
const require = createRequire(import.meta.url);
const { arrayAverage, quantile } = require("./statistic.js");

const inPath = "./images/input/png";
const outPath = "./images/output";

const width = 1024;
const height = 768;

const measures = [];
const libs = ["deno_imagemagick","deno_image","deno_imagescript"]

await initializeImageMagick();

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

async function runBench() {
  //ImageMagick
  performance.clearMarks()
  performance.mark("ImageMagick-start");
  for await (const dirEntry of Deno.readDir(inPath)) {
    ImageMagick.read(
      await Deno.readFile(inPath + "/" + dirEntry.name),
      (img) => {
        img.resize(width, height);
        img.write(async (data) => {
          await Deno.writeFile(
            outPath + "/result-" + dirEntry.name + ".jpeg",
            data
          );
        }, MagickFormat.Jpeg);
      }
    );
  }
  performance.mark("ImageMagick-end");
  //Deno-Image
  performance.mark("Deno-image-start");
  for await (const dirEntry of Deno.readDir(inPath)) {
    const img = await resize(
      await Deno.readFile(inPath + "/" + dirEntry.name),
      {
        width: width,
        height: height,
      }
    );
    await Deno.writeFile(outPath + "/result-" + dirEntry.name + ".jpeg", img);
  }
  performance.mark("Deno-image-end");
  //Imagescript
  performance.mark("Imagescript-start");
  for await (const dirEntry of Deno.readDir(inPath)) {
    const image = await Image.decode(
      await Deno.readFile(inPath + "/" + dirEntry.name)
    );
    image.resize(width, height);
    await Deno.writeFile(
      outPath + "/result" + dirEntry.name + ".jpeg",
      await image.encodeJPEG()
    );
  }
  performance.mark("Imagescript-end");

  return {
    deno_imagemagick: performance.measure("imagemagick","ImageMagick-start","ImageMagick-end").duration,
    deno_image: performance.measure("deno-image","Deno-image-start","Deno-image-end").duration,
    deno_imagescript: performance.measure("imagescript","Imagescript-start","Imagescript-end").duration,
  };
}
