// 2 testfolders, to simulate the whole thing, assumed local and assumed shared (NAS or so)
// • must be outside project (no subfolder), otherwise that would be under-a-repo, eh?
// • spaces, umlauts, unicode to harden the test

import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import os from 'os'
import { guard, ensureTrue } from '@nocke/util'
import getConfig from '../src/getConfig.js'

const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

const LOCAL = path.join(os.tmpdir(), 'LØCÅL -_Føldër😬')
const SHARE = path.join(os.tmpdir(), 'SHÃRË -_Føldër😬')

const defaultConfig = getConfig.loadJsonC(`${PROJECTROOT}/defaultConfig.json`)

const wipeAndRecreateDir = (dir, _label) => {
  // info(`recreating ${_label}: ${dir}`)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
  fs.mkdirSync(dir, { recursive: true })
  ensureTrue(fs.readdirSync(dir).length === 0, 'test directory not empty')
}

// overriden in some (negative) tests
let synclocal
let syncshare

// normal test basis
// (…Basic also avoids name clashes with beforeEach)
const beforeEachBasic = function(done) {
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
}

export {
  PROJECTROOT,
  LOCAL,
  SHARE,
  beforeEachBasic,
  defaultConfig,
  synclocal,
  syncshare
}
