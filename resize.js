'use strict'

const config = require('config')
const jimp = require('jimp')
const path = require('path')

module.exports = async (imgPath, callback) => {
  // Checking of input parameters
  if (!imgPath) {
    console.error('!!! Path to the image must be setted as the first parameter.')
    return
  }
  if (config.has('destFolderPath')) {
    const destFolderPath = config.get('destFolderPath')
  } else {
    console.error('!!! Destination folder for new image must be setted in config.')
    return
  }
  if (config.has('newWidth')) {
    const newWidth = config.get('newWidth')
  } else {
    console.error('!!! Width for new image must be setted in config.')
    return
  }
  if (config.has('newHeight')) {
    const newHeight = config.get('newHeight')
  } else {
    const newHeight = jimp.AUTO
  }
  if (config.has('watermarkImgPath')) {
    const watermarkImgPath = config.get('watermarkImgPath')
  } else {
    console.error('!!! Path to watermark image must be setted in config.')
    return
  }
  if (config.has('opacitySource')) {
    const opacitySource = config.get('opacitySource')
  } else {
    console.error('!!! Opacity must be setted in config.')
    return
  }

  const newImgPath = destFolderPath +
    path.sep +
    'resized_' +
    path.basename(imgPath)

  const destImage = await jimp.read(imgPath)
  const watermarkImage = await jimp.read(watermarkImgPath)

  // calc the center of destination image
  const x = destImage.bitmap.width / 2 - watermarkImage.bitmap.width / 2
  const y = destImage.bitmap.height / 2 - watermarkImage.bitmap.height / 2

  await destImage.resize(newWidth, newHeight)
  await destImage.composite(watermarkImage, x, y, {
    opacitySource: opacitySource
  })
  await destImage.quality(80)
  await destImage.writeAsync(newImgPath)

  callback(null)
}
