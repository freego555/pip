'use strict'

const jimp = require('jimp')
const path = require('path')

async function main () {
  const imgPath = process.argv[2]
  const width = +process.argv[3]
  const height = +process.argv[4]
  const watermarkPath = process.argv[5]

  const newImgPath = await resizeImage(imgPath, width, height)
  await watermarkImageCopy(newImgPath, watermarkPath)
}

async function resizeImage (imgPath, width, height) {
  // Checking of input parameters
  if (!imgPath) {
    console.error('!!! Path to the image must be setted as the first parameter.')
    return
  }
  if (Number.isNaN(width)) {
    console.error('!!! Width for new image must be setted as the second parameter.')
    return
  }
  height = (Number.isNaN(height)) ? jimp.AUTO : height
  const newImgPath = path.dirname(imgPath) +
    path.sep +
    'resized_' +
    path.basename(imgPath)

  const image = await jimp.read(imgPath)
  await image.resize(width, height)
  await image.quality(80)
  await image.writeAsync(newImgPath)
  console.log('Resizing was succesful')

  return newImgPath
}

async function watermarkImageCopy (destPath, watermarkPath) {
  const newImgPath = path.dirname(destPath) +
    path.sep +
    'watermarked_' +
    path.basename(destPath)

  const destImage = await jimp.read(destPath)
  const watermarkImage = await jimp.read(watermarkPath)

  // calc the center of destination image
  const x = destImage.bitmap.width / 2 - watermarkImage.bitmap.width / 2
  const y = destImage.bitmap.height / 2 - watermarkImage.bitmap.height / 2

  await destImage.composite(watermarkImage, x, y, {
    opacitySource: 0.5
  })
  await destImage.writeAsync(newImgPath)
  console.log('Watermarking was succesful')

  return newImgPath
}

main()
