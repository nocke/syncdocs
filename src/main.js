
import { info, loggedMainWrap } from '@nocke/util'
import smokecheck from './smokeCheck.js'
import fs from 'fs'
import getConfig from './getConfig.js'

loggedMainWrap(async () => {

  process.argv.forEach((val, index) => {
    info(`${index}: ${val}`)
  })

  smokecheck()
  const config = getConfig()
  info(`config: ${config}`)

  // TEMPTEMP
  fs.writeFile('howdy.txt', 'Hello, world!', (err) => {
    if (err) throw err
    console.log('File created successfully!')
  })

  // NEXT: script..

})
