const jimp = require("jimp");
const imagemagick = require("imagemagick");
const gm = require("gm");
const sharp = require("sharp");
const image = require("imagescript")

const path = require("path");
const fs = require("fs");

const inPath = `.${path.sep}images${path.sep}input${path.sep}png`;
const outPath = `.${path.sep}images${path.sep}output`;

const width = 1024;
const height = 768;

async function getFiles() {
  return fs.promises.readdir(inPath);
}

async function runGm() {
  for (const file of await getFiles()) {
    await new Promise((resolve, reject) => {
      gm(`${inPath}${path.sep}${file}`)
        .resize(width, height, "!")
        .write(`${outPath}${path.sep}result-${file}.jpeg`, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });
  }
}

async function runImageMagick() {
  for (const file of await getFiles()) {
    await new Promise((resolve, reject) => {
      imagemagick.resize(
        {
          srcPath: `${inPath}${path.sep}${file}`,
          dstPath: `${outPath}${path.sep}result-${file}.jpeg`,
          width: width,
          height: height,
          format: "jpg",
        },
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

async function runJimp() {
  for (const file of await getFiles()) {
    const image = await jimp.read(`${inPath}${path.sep}${file}`);
    image.resize(width, height);
    await image.writeAsync(`${outPath}${path.sep}result-${file}.jpeg`);
  }
}

async function runSharp() {
  for (const file of await getFiles()) {
    const image = sharp(`${inPath}${path.sep}${file}`).resize(width, height);
    await image.toFile(`${outPath}${path.sep}result-${file}.jpeg`);
  }
}

async function runImageScript() {
  for (const file of await getFiles()) {
    const img = await image.decode(await fs.promises.readFile(`${inPath}${path.sep}${file}`))
    await img.resize(width, height)
    await fs.promises.writeFile(`${outPath}${path.sep}result-${file}.jpeg`, await img.encodeJPEG())
  }
}

module.exports = { runJimp, runSharp, runGm, runImageMagick, runImageScript };
