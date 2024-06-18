import { check, ensureTrue, info } from '@nocke/util'

export default () => {

  {
    const nodeVersionString = check('node --version',{getResult: true, mute: true}).trim()
    ensureTrue(nodeVersionString.length > 0, 'node not properly installed (?)')

    const nodeVersionMatch = nodeVersionString.match(/^v(\d+)\.(\d+)\.(\d+)/)
    ensureTrue(nodeVersionMatch!==null, 'malformed node version string')

    const nodeMajor = parseInt(nodeVersionMatch[1], 10)
    ensureTrue(nodeMajor >= 20, `node version must be 20.x or higher, was ${nodeMajor}`)
  }

  {
    const gitVersionString = check('git --version',{getResult: true, mute: true}).trim()
    ensureTrue(gitVersionString.length > 0, 'git not installed')

    // check git version at least 2.2
    const versionMatch = gitVersionString.match(/^git version (\d+)\.(\d+)\.(\d+)/)
    ensureTrue(versionMatch!==null, 'malformed git version string')

    const major = parseInt(versionMatch[1], 10)
    const minor = parseInt(versionMatch[2], 10)
    ensureTrue(major > 2 || (major === 2 && minor >= 10), 'Git version must be 2.10 or higher')
  }

  info('smokeCheck: ok')
}
