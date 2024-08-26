import { ensureFalse, ensureFileExists, ensureFolderExists, ensureTrue, ensureTruthy, fail, info, warn } from '@nocke/util'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

/* returns the config object, overlaying
   • defaultConfig (excludes Dir info)
   • (localSyncDir)/.syncdocs.json (also serving as a marker file!)
*/

const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

// yes, can handle JSONC with comments, and trailing commas \o/
function loadJsonC(path) {
  ensureFileExists(path,`path: ${path} does not exist`)
  try {
    const jsoncfile = fs.readFileSync(path, 'utf8')
    const withoutComments = jsoncfile.replace(/(?<=(^|[^"]*"[^"]*")*[^"]*)\/\/.*$/gm, '')
    const withoutTrailingCommas = withoutComments.replace(/,\s*([\]}])/g, '$1'); // Remove trailing commas
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

export default (cwd) => {
  info(`getConig | cwd: ${cwd}`)

  // unclear if needed
  const testMode = isTestMode()
  info(`Test Mode: ${testMode}`)

  // check if there is a .syncdocs.json in the CURRENT dir
  const syncdocsJsonPath = '.syncdocs.json'
  const hasSyncdocsJson = fs.existsSync(syncdocsJsonPath)
  if (!hasSyncdocsJson) {
    fail(`No .syncdocs.json found in current directory ${cwd} — not a syncdocs folder?`)
  }
  ensureFolderExists('.git',`No .git folder in current directory ${cwd}, only a .syncdocs.json — trouble?`)

  const defaultJson = loadJsonC(path.join(PROJECTROOT, 'defaultConfig.json'))
  const projectJson = loadJsonC(syncdocsJsonPath)

  const mustBeInProjectJson = ['machineName', 'localRepo', 'shareRepo']
  mustBeInProjectJson.forEach((prop) => {
    ensureTrue( defaultJson[prop] === undefined, `key: ${prop} must not be in defaultJson`)
    ensureTruthy( projectJson[prop] && projectJson[prop].length > 0, `key: ${prop} must be in .syncdocs.json`)
  })

  const combinedJSON = {
    ...defaultJson,
    ...projectJson
  }

  return combinedJSON
}
