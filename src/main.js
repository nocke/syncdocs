
import { info, loggedMainWrap } from '@nocke/util'
import smokecheck from './smokecheck.js'

loggedMainWrap(async () => {

  process.argv.forEach((val, index) => {
    info(`${index}: ${val}`)
  })

  smokecheck()

  // NEXT: script..
})
