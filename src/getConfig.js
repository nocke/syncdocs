import { ensureFileExists, fail, info, warn } from '@nocke/util'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

/* returns the config object, overlaying
   • defaultConfig (excludes Dir info)
   • (localSyncDir)/.syncdocs.json (also serving as a marker file!)
*/

const PROJECTROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

function loadJson(path) {
  ensureFileExists(path,`path: ${path} does not exist`)
  try {
    const jsoncfile = fs.readFileSync(path, 'utf8')
    const jsonWithoutComments = jsoncfile.replace(/(?<=(^|[^"]*"[^"]*")*[^"]*)\/\/.*$/gm, '')
    return JSON.parse(jsonWithoutComments)
  } catch (error) {
    fail(`failed on loading/parsing JSON-File '${path}': ${error.message}`)
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

  const testMode = isTestMode()
  info(`Test Mode: ${testMode}`)

  // check if there is a .syncdocs.json in the CURRENT dir
  const syncdocsJsonPath = '.syncdocs.json'
  const hasSyncdocsJson = fs.existsSync(syncdocsJsonPath)
  if (!hasSyncdocsJson) {
    fail(`No .syncdocs.json found in ${PROJECTROOT}`)
  }

  const combinedJSON = {
    ...loadJson(path.join(PROJECTROOT, 'defaultConfig.json')),
    ...loadJson(syncdocsJsonPath)
  }

  return combinedJSON
}
