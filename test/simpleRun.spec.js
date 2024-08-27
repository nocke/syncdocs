import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import os from 'os'
import { info, guard, ensureTrue, warn } from '@nocke/util'
import getConfig from '../src/getConfig.js'
import { assert } from 'chai'

const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')
// 2 testfolders, to simulate the whole thing, assumed local and assumed shared (NAS or so)
// • must be outside project (no subfolder), otherwise that would be under-a-repo, eh?
// • spaces, umlauts, unicode to harden the test

const defaultConfig = getConfig.loadJsonC(`${PROJECTROOT}/defaultConfig.json`)

const LOCAL = path.join(os.tmpdir(), 'LØCÅL -_Føldër😬')
const SHARE = path.join(os.tmpdir(), 'SHÃRË -_Føldër😬')
const wipeAndRecreateDir = (dir, label) => {
  info(`recreating ${label}: ${dir}`)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
  fs.mkdirSync(dir, { recursive: true })
  ensureTrue(fs.readdirSync(dir).length === 0, 'test directory not empty')
}

beforeEach(done => {
  wipeAndRecreateDir(LOCAL, 'LOCAL TESTDIR')
  wipeAndRecreateDir(SHARE, 'SHARE TESTDIR')

  // make up appropriate
  const syncdocs = {
    machineName: os.hostname(),
    localRepo: LOCAL,
    shareRepo: SHARE
  }

  fs.writeFileSync(
    path.join(LOCAL, '.syncdocs.json'),
    JSON.stringify(syncdocs, null, 2))

  const DIRS = [LOCAL, SHARE]
  DIRS.forEach(DIR => {
    warn(`setting up ${DIR}`)
    process.chdir(DIR)
    guard('git init', { mute: true })

    // NEXT `cp -r some stuff to both sides, then deviate
  })

  process.chdir(LOCAL)  // crucial for testing !
  done()
})

describe('Main Script Execution', () => {
  // const testFilePath = path.join(LOCAL, 'howdy.txt')

  // REF Future Stuff to do
  // process.chdir(PROJECTROOT)
  // guard('ls -l .', {})
  // TEMP LATER guard(`node ${PROJECTROOT}/src/main.js`, {})
  // assert(fs.existsSync(testFilePath), `did not find ${testFilePath}`)
  //   if (error) {
  //     console.error(`exec error: ${error}`)
  //     return done(error)
  //   }
  //   // Check if howdy.txt has been created
  //   assert(fs.existsSync(testFilePath))
  //   done()
  // })

  it.only('should get reasonable config', function() {
    console.log('howdy, partner!')
    console.log('Current working directory:', process.cwd())

    const config = getConfig(process.cwd())
    // console.log('config:', config)

    ensureTrue(typeof config.machineName === 'string' && config.machineName.length > 0, 'machineName is missing or empty');
    assert.strictEqual(config.localRepo, LOCAL);
    assert.strictEqual(config.shareRepo, SHARE)
    assert.deepStrictEqual(config.tooBigExtensions, defaultConfig.tooBigExtensions)

    assert(Number.isInteger(config.MAX_FILE_SIZE_MB), 'MAX_FILE_SIZE_MB is not a whole number');
    assert(config.MAX_FILE_SIZE_MB >= 5 && config.MAX_FILE_SIZE_MB <= 300, 'MAX_FILE_SIZE_MB is not between 5 and 300');
  })

})
