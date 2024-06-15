
import { info, loggedMainWrap } from '@nocke/util'

loggedMainWrap(async () => {

  process.argv.forEach((val, index) => {
    info(`${index}: ${val}`)
  })

})
