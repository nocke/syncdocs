
import { info, loggedMainWrap } from '@nocke/util'
import smokecheck from './smokeCheck.js'
import fs from 'fs'
import getConfig from './getConfig.js'

loggedMainWrap(async () => {
  const cwd = process.cwd() // Get current working directory

  process.argv.forEach((val, index) => {
    info(`${index}: ${val}`)
  })

  smokecheck()
  const config = getConfig(cwd) // Pass cwd to getConfig
  info(`config: ${JSON.stringify(config)}`)

  // TEMPTEMP
  fs.writeFile('howdy.txt', 'Hello, world!', (err) => {
    if (err) throw err
    console.log('File created successfully!')
  })

  // NEXT: script..

})
