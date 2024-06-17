
import { info, loggedMainWrap } from '@nocke/util'
import smokecheck from './smokecheck.js'
import fs from 'fs'

loggedMainWrap(async () => {

  process.argv.forEach((val, index) => {
    info(`${index}: ${val}`)
  })

  smokecheck()

  // TEMPTEMP
  fs.writeFile('howdy.txt', 'Hello, world!', (err) => {
    if (err) throw err
    console.log('File created successfully!')
  })

  // NEXT: script..

})
