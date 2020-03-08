'use strict'

const jimp = require('jimp')
const path = require('path')

async function resizeImage(imgPath, width, height) {
    // Checking of input parameters
    if (!imgPath) {
        console.log('!!! Path to the image must be setted as the first parameter.')
        return
    }
    if (Number.isNaN(width)) {
        console.log('!!! Width for new image must be setted as the second parameter.')
        return
    }
    height = (Number.isNaN(height)) ? jimp.AUTO : height

    const image = await jimp.read(imgPath)
    await image.resize(width, height)
    await image.writeAsync(path.dirname(imgPath)
        + path.sep
        + 'resized_'
        + path.basename(imgPath))
    console.log('Resizing was succesful')
}

const imgPath = process.argv[2]
const width = +process.argv[3]
const height = +process.argv[4]

resizeImage(imgPath, width, height)