import { ensureFalse, ensureFileExists, ensureFolderExists, ensureTrue, ensureTruthy, fail, important, info, warn } from '@nocke/util'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

/* returns the config object, overlaying
   • defaultConfig (excludes Dir info)
   • (localSyncDir)/.syncdocs.json (also serving as a marker file!)
*/
const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

const mandatoryLocalKeys = ['machineName', 'localRepo', 'shareRepo']
const knownShareKeys = ['MAX_FILE_SIZE_MB', 'excludedExtensions']
const minimumAggregateKeys = [ ...mandatoryLocalKeys, 'excludedExtensions', 'MAX_FILE_SIZE_MB']

// • yes, can handle JSONC with comments and trailing commas \o/
// • treats empty files ( <50 byte length) like empty objects
function loadJsonC(path) {
  ensureFileExists(path,`path: ${path} does not exist`)
  try {
    const jsoncfile = fs.readFileSync(path, 'utf8')

    if (jsoncfile.length < 50 && jsoncfile.trim().length === 0)
    {
      return {}
    }

    const withoutComments = jsoncfile.replace(/(?<=(^|[^"]*"[^"]*")*[^"]*)\/\/.*$/gm, '')
    const withoutTrailingCommas = withoutComments.replace(/,\s*([\]}])/g, '$1') // Remove trailing commas
    return JSON.parse(withoutTrailingCommas)
  } catch (error) {
    fail(`failed on loading/parsing JSON/JSONC-File '${path}': ${error.message}`)
  }
}

// testmode (are we in the repo) is detected by some crucial files
// being present and right name in package.json
const isTestMode = () => {
  const filesToCheck = ['LICENSE.txt', 'README.md', 'package.json']

  for (const file of filesToCheck) {
    if (!fs.existsSync(path.join(PROJECTROOT, file))) {
      info(`Test Mode: ${file} not found`)
      return false
    }
  }

  const packageJsonPath = path.join(PROJECTROOT, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    info(`Test Mode: package.json not found`)
    return false
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  return packageJson.name && packageJson.name.toLowerCase().includes('syncdocs')
}

const getConfig = (cwd) => {
  info(`getConfig | cwd: ${cwd}`)

  // unclear if needed
  const testMode = isTestMode()
  info(`Test Mode: ${testMode}`)

  // check if there is a .syncdocs.json in the CURRENT dir
  const localJsonPath = '.synclocal.json'
  if (!fs.existsSync(localJsonPath)) {
    fail(`No .syncdocs.json found in current directory ${cwd} — not a syncdocs folder?`)
  }
  ensureFolderExists('.git',`No .git folder in current directory ${cwd}, only a .syncdocs.json — trouble?`)

  const defaultJson = loadJsonC(path.join(PROJECTROOT, 'defaultConfig.json'))
  const localJson = loadJsonC(localJsonPath)

  // ensuree strict number of local keys
  ensureTrue(Object.keys(localJson).length == mandatoryLocalKeys.length,
    `local '.syncdocs.json' must have exactly ${mandatoryLocalKeys.length} keys: ${mandatoryLocalKeys.join(', ')}`)
  mandatoryLocalKeys.forEach((prop) => {
    ensureTrue( defaultJson[prop] === undefined, `key: ${prop} must not be in defaultJson`)
    ensureTruthy( localJson[prop] && localJson[prop].length > 0, `key: ${prop} must be in .syncdocs.json`)
  })

  // ensure share keys: no overlap with local, no unknown keys
  ensureFolderExists(localJson.shareRepo, `folder given as 'shareRepo' '${localJson.shareRepo}' does not exist`)
  const shareJsonPath = path.join(localJson.shareRepo, '.syncshare.json')
  ensureFileExists(shareJsonPath, `central .syncshare json: '${shareJsonPath}' does not exist`)

  const shareJson = loadJsonC(shareJsonPath)
  // ensure absence in shareJson first (next would also cover, but more helpful error msg)
  mandatoryLocalKeys.forEach((prop) => {
    ensureFalse(!!shareJson[prop], `key: ${prop} must not be in shareJson`)
  })

  Object.keys(shareJson).forEach((prop) => {
    ensureTrue(knownShareKeys.includes(prop), `.syncshare: unknown key '${prop}'`)
  })

  const combinedJSON = {
    ...defaultJson,
    ...shareJson,
    ...localJson
  }

  minimumAggregateKeys.forEach((prop) => {
    ensureTruthy(combinedJSON[prop], `key: ${prop} must be found in combinedJSON`)
  })

  return combinedJSON
}

getConfig.loadJsonC = loadJsonC // sneak out, handy for testing
export default getConfig
