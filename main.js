'use strict'

const config = require('config')
const fs = require('fs')
const workerFarm = require('worker-farm')
const serviceResize = workerFarm(require.resolve('./resize'))

async function main () {
  const srcFolderPath = config.has('srcFolderPath') ? config.get('srcFolderPath') : undefined

  // Checking of input parameters
  if (!srcFolderPath) {
    console.error('!!! Source folder path must be setted in config.')
    return
  }

  // Read images from the directory and resize them by serviceResize
  await fs.readdir(srcFolderPath, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      serviceResize(files[i], (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
  })
}

main()
