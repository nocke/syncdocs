import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { info, guard, ensureTrue } from '@nocke/util'
import os from 'os'


const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

// 2 testfolders, to simulate the whole thing, assumed local and assumed shared (NAS or so)
// • must be outside project (no subfolder), otherwise that would be under-a-repo, eh?
// • spaces, umlauts, unicode to harden the test

const LOCAL = path.join(os.tmpdir(), 'LØCÅL -_Føldër😬™')
const SHARE = path.join(os.tmpdir(), 'SHÃRË -_Føldër😬™')

const wipeAndRecreateDir = (dir, label) => {
  info(`recreating ${label}: ${dir}`)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
  fs.mkdirSync(dir, { recursive: true })
  ensureTrue(fs.readdirSync(dir).length === 0, 'test directory not empty')
}

describe('Main Script Execution', () => {
  // const testFilePath = path.join(LOCAL, 'howdy.txt')
  beforeEach(done => {
    wipeAndRecreateDir(LOCAL, 'LOCAL TESTDIR')
    wipeAndRecreateDir(SHARE, 'SHARE TESTDIR')
    process.chdir(LOCAL)  // crucial for testing !

    // make up appropriate
    const syncdocs = {
      machineName: os.hostname(),
      localRepo: LOCAL,
      shareRepo: SHARE
    }

    fs.writeFileSync(
      path.join(LOCAL, '.syncdocs.json'),
      JSON.stringify(syncdocs, null, 2))

    done()
  })

  it('should get reasonable config', function() {

    // process.chdir(PROJECTROOT)
    // guard('ls -l .', {})

    guard(`node ${PROJECTROOT}/src/main.js`, {})

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
