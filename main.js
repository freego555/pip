'use strict'

const path = require('path')
const workerFarm = require('worker-farm')
const serviceResize = workerFarm(require.resolve('./resize'))

async function main () {
  //TODO: Read images from the directory in the loop and resize them by serviceResize
}

main()
