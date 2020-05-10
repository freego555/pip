'use strict'

const config = require('config')
const fs = require('fs')
const notify = require('fs.notify')
const workerFarm = require('worker-farm')
const serviceResize = workerFarm(require.resolve('./resize'))
const srcFolderPath = config.has('srcFolderPath') ? config.get('srcFolderPath') : undefined

async function main () {
  // Checking of input parameters
  if (srcFolderPath) {
    resizeFilesFromDir(srcFolderPath)

    // Add notifications about changes in source folder
    const notifications = new notify(srcFolderPath)
    notifications.on('change', (file, event) => {
      if (event.localeCompare('rename') == 0) {
        serviceResize(file, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }

      // TODO: How to do nothing if it is removing of file
    })
  } else {
    console.error('!!! Source folder path must be setted in config.')
  }
}

async function resizeFilesFromDir (path) {
  // Read images from the directory and resize them by serviceResize
  await fs.readdir(path, (err, files) => {
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