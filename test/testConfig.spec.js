import fs from 'fs'
import path from 'path'
import os from 'os'
import { ensureTrue } from '@nocke/util'
import getConfig from '../src/getConfig.js'
import { assert } from 'chai'
import { LOCAL, SHARE, defaultConfig, beforeEachBasic, synclocal, syncshare } from './testutils.js'


describe('Config Tests', () => {
  beforeEach( done => beforeEachBasic(done) )

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
