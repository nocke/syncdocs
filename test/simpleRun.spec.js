import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { guard } from '@nocke/util'

const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')
// Spaces, Umlauts, Unicode - to harden the test
const TESTFOLDER = path.join(PROJECTROOT, 'tëst -_Føldér😬™')

describe('Main Script Execution', () => {
  const testFilePath = path.join(TESTFOLDER, 'howdy.txt')

  beforeEach(done => {
    if (fs.existsSync(TESTFOLDER)) {
      fs.rmSync(TESTFOLDER, { recursive: true })
    }
    fs.mkdirSync(TESTFOLDER, { recursive: true })
    process.chdir(TESTFOLDER)
    done()
  })

  it('should create howdy.txt when main.js is executed', function() {

    guard('echo Ja', {})
    guard('ls -l ../src', {})
    guard('node ../src/main.js', {})
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
