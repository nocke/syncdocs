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
  // info(`recreating ${label}: ${dir}`)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
  fs.mkdirSync(dir, { recursive: true })
  ensureTrue(fs.readdirSync(dir).length === 0, 'test directory not empty')
}

// overriden in some (negative) tests
let synclocal
let syncshare

beforeEach(done => {
  wipeAndRecreateDir(LOCAL, 'LOCAL TESTDIR')
  wipeAndRecreateDir(SHARE, 'SHARE TESTDIR')

  // prepare .synclocal.json
  synclocal = {
    machineName: os.hostname(),
    localRepo: LOCAL,
    shareRepo: SHARE
  }

  fs.writeFileSync(
    path.join(LOCAL, '.synclocal.json'),
    JSON.stringify(synclocal, null, 2)
  )

  // prepare .syncshare.json
  syncshare = {
    "MAX_FILE_SIZE_MB": 42,
  }

  fs.writeFileSync(
    path.join(SHARE, '.syncshare.json'),
    JSON.stringify(syncshare, null, 2)
  )

  const DIRS = [LOCAL, SHARE]
  DIRS.forEach(DIR => {
    // warn(`setting up ${DIR}`)
    process.chdir(DIR)
    guard('git init', { mute: true })
  })

  process.chdir(LOCAL)  // crucial for testing !
  done()
})

describe.only('Config Tests', () => {

  it('should get reasonable config', function() {
    assert.strictEqual(process.cwd(), LOCAL) // ensure setup did not mess up
    const config = getConfig(process.cwd())

    ensureTrue(typeof config.machineName === 'string' && config.machineName.length > 0, 'machineName is missing or empty')

    assert.deepStrictEqual(config, {
      localRepo: LOCAL,
      shareRepo: SHARE,
      machineName: os.hostname(),
      excludedExtensions: defaultConfig.excludedExtensions,
      MAX_FILE_SIZE_MB: 42 // coming from .syncshare.json override
    })

    assert(Number.isInteger(config.MAX_FILE_SIZE_MB), 'MAX_FILE_SIZE_MB is not a whole number')
    assert(config.MAX_FILE_SIZE_MB >= 5 && config.MAX_FILE_SIZE_MB <= 300, 'MAX_FILE_SIZE_MB is not between 5 and 300')
  })

  it('negative: non-existing .syncshare', function() {
    fs.unlinkSync(path.join(SHARE, '.syncshare.json'))
    assert.throws(
      () => {
        getConfig(process.cwd())
      }, Error)
  })

  it('negative: non-existing .synclocal', function() {
    fs.unlinkSync(path.join(LOCAL, '.synclocal.json'))
    assert.throws(
      () => {
        getConfig(process.cwd())
      }, Error)
  })

  it('positive: empty but existing .syncshare', function() {
    fs.writeFileSync(path.join(SHARE, '.syncshare.json'), '  \n  ')
    const config = getConfig(process.cwd())

    assert.deepStrictEqual(config, {
      localRepo: LOCAL,
      shareRepo: SHARE,
      machineName: os.hostname(),
      excludedExtensions: defaultConfig.excludedExtensions,
      MAX_FILE_SIZE_MB: defaultConfig.MAX_FILE_SIZE_MB // original config then
    })
  })

  it('negative: too much in .syncshare', function() {
    syncshare.banana = '42'
    fs.writeFileSync(
      path.join(SHARE, '.syncshare.json'),
      JSON.stringify(syncshare, null, 2)
    )

    assert.throws(
      () => {
        getConfig(process.cwd())
      }, Error)
  })

  it('negative: too much in .synclocal', function() {
    synclocal.banana = '42'
    fs.writeFileSync(
      path.join(LOCAL, '.synclocal.json'),
      JSON.stringify(synclocal, null, 2)
    )
    assert.throws(
      () => {
        getConfig(process.cwd())
      }, Error)
  })

})
