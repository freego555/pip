'use strict'

const Jimp = require('jimp')

async function resizeImage(path, width, height = Jimp.AUTO) {
    const image = await Jimp.read(path)
    await image.resize(width, height)
    await image.writeAsync(path)
    console.log('Resizing was succesful')
}

const imgPath = process.argv[2]
const width = +process.argv[3]
const height = +process.argv[4]
resizeImage(imgPath, width, height)