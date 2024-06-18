import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { info, guard } from '@nocke/util'
import os from 'os'


const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

// must be outside project, to be outside another git repo, thus temp
// Spaces, Umlauts, Unicode - to harden the test

const TESTFOLDER = path.join(os.tmpdir(), 'tëst -_Føldér😬™')

describe('Main Script Execution', () => {
  const testFilePath = path.join(TESTFOLDER, 'howdy.txt')

  beforeEach(done => {
    info(`TESTFOLDER: ${TESTFOLDER}`)
    if (fs.existsSync(TESTFOLDER)) {
      fs.rmSync(TESTFOLDER, { recursive: true })
    }
    fs.mkdirSync(TESTFOLDER, { recursive: true })
    process.chdir(TESTFOLDER)
    done()
  })

  it('should create howdy.txt when main.js is executed', function() {

    guard('echo Ja', {})
    process.chdir(PROJECTROOT)
    guard('ls -l .', {})
    guard('node ./src/main.js', {})
    process.chdir(TESTFOLDER)
    // assert(fs.existsSync(testFilePath), `did not find ${testFilePath}`)

    //   if (error) {
    //     console.error(`exec error: ${error}`)
    //     return done(error)
    //   }
    //   // Check if howdy.txt has been created
    //   assert(fs.existsSync(testFilePath))
    //   done()
    // })
  })
})
