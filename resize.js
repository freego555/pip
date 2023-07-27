'use strict';

const config = require('config');
const jimp = require('jimp');
const path = require('path');

module.exports = async (imgName, callback) => {
  try {
    const srcFolderPath = config.has('srcFolderPath')
      ? config.get('srcFolderPath')
      : undefined;
    const destFolderPath = config.has('destFolderPath')
      ? config.get('destFolderPath')
      : undefined;
    const newWidth = config.has('newWidth')
      ? config.get('newWidth')
      : undefined;
    const newHeight = config.has('newHeight')
      ? config.get('newHeight')
      : jimp.AUTO;
    const watermarkImgPath = config.has('watermarkImgPath')
      ? config.get('watermarkImgPath')
      : undefined;
    const opacitySource = config.has('opacitySource')
      ? config.get('opacitySource')
      : undefined;

    // Checking of input parameters
    let isChecked = true;
    if (!imgName) {
      console.error('!!! Image name must be setted as the first parameter.');
      isChecked = false;
    }
    if (!srcFolderPath) {
      console.error(
        '!!! Destination folder for new image must be setted in config.',
      );
      isChecked = false;
    }
    if (!destFolderPath) {
      console.error(
        '!!! Destination folder for new image must be setted in config.',
      );
      isChecked = false;
    }
    if (!newWidth) {
      console.error('!!! Width for new image must be setted in config.');
      isChecked = false;
    }
    if (!watermarkImgPath) {
      console.error('!!! Path to watermark image must be setted in config.');
      isChecked = false;
    }
    if (!opacitySource) {
      console.error('!!! Opacity must be setted in config.');
      isChecked = false;
    }

    if (isChecked) {
      const imgPath = srcFolderPath + path.sep + imgName;
      const newImgPath =
        destFolderPath + path.sep + 'resized_' + path.basename(imgPath);

      const srcImage = await jimp.read(imgPath);
      const watermarkImage = await jimp.read(watermarkImgPath);

      await srcImage.resize(newWidth, newHeight);

      // calc the center of source image
      const x = srcImage.bitmap.width / 2 - watermarkImage.bitmap.width / 2;
      const y = srcImage.bitmap.height / 2 - watermarkImage.bitmap.height / 2;

      await srcImage.composite(watermarkImage, x, y, {
        opacitySource: opacitySource,
      });
      await srcImage.quality(80);
      await srcImage.writeAsync(newImgPath);
    } else {
      throw 'There were some errors during resizing.';
    }

    callback(null);
  } catch (e) {
    callback(e);
  }
};
