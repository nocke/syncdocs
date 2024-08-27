# syncdocs

[![Syncdocs version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnocke%2Fsyncdocs%2Fmaster%2Fpackage.json&query=version&label=Syncdocs%20Version&color=%230f80ff&link=https%3A%2F%2Fgithub.com%2Fnocke%2Fsyncdocs%2Fblob%2Fmaster%2Fpackage.json%23L3)](https://github.com/nocke/syncdocs/blob/master/package.json#L3)
[![nocke syncdocs tests](https://img.shields.io/github/actions/workflow/status/nocke/syncdocs/node20.yml)](https://github.com/nocke/syncdocs/actions)

### highly simplified git versioning for non-technical users. <br>_“surviving your daily flood of bureaucratic cruft”_

<img src="./docs/img/syncDocsCover.jpg" alt="SyncDocs Cover Image" style="width: 100%; height: auto;">

### Is `syncdocs` a good tool to work on my source code?

> No, isn't. Use regular `git`, to have defined precisely version states for every file of your repository for every commit you do. Nothing of value for you here.

### I need to jam my letters, invoices, tax stuff, etc… together in one place, well in several places, but basically the same huge tree. I want mutual updating and not loosing elder versions of stuff. Should be extremly easy to do that syncing.

> This is a tool, that helps handling those incoming, ever-growing documents (i.e. invoices, notes, pdfs, bureaucractic cruft) in one central place, yet also decentralized, with offline access and syncing as a nobrainer.

`syncdocs` has 1 end-user friendly command with 0 parameters to use. As much as I love git, no commit|pull|push|rebase and certainly no resolve-merge-conflicts makes things much easier for end users. Yet, it does harnesses many benefits of regular `git` use:
 * very easy syncing
 * versioning of course
 * largely conflict-free merges
 * rename detection (quite a feature actually!)
 * smart merging of anything plain-text (something-added-here vs. something-added-there in the same file will go together as you may expect)
 * some opinionated-ness, when non-text file changes collide (PDFs, images, …). spoiler: both versions will make it into recoverably version history)
 * recoverability (it doesn't matter if your server or client get's stolen or destroyed, as long as the-other-side is still around)
 * no system/platform/vendor-lock (all files are still in plain sight, in your file system, in a valid git repository, no fragile database, not somewhere in the cloud, …) If you do get into trouble, at least a git-savy person should be able to help.

    > syncdocs
    TBD
    ▁

## technical view

The idea being to sync personal data (text, pdf documents and invoices, screenshots, _not_ source code) between a central git repository and various workstations with regular _client repos_

The idea being that your family members can also add stuff offline, i.e. on the road, and it all eventually ends up everywhere...

[![](https://mermaid.ink/img/pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA?type=png)](https://mermaid.live/edit#pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA)

**Sounds like something `git` would do out of the box, right? Yeah, but...**

* central repo is editable, too, _not_ a pure-server “bare repo”
* **end-users get a single, zero-param `syncdocs` command, no pull, no add, no commit, no push, never to bother with merge conflicts**
* collisions in given usage scenarios shall be rare (it's mostly about adding cruft), but will occur: in which case _both_ versions are preserved in version history: the more central one “wins” as the latter version, the other one preserved underneath.
* it's still valid git repos on all ends (→no vendor-lock/platform neutrality), so you can add/integrate further things (i.e. commit hooks to the server), or analyse/retrieve elder versions with regular git tools like my favourite, [smartgit](https://www.syntevo.com/smartgit/).

## author

Frank Nocke

## development

This initially developed as a shell script, but things got a bit more tricky on some edge cases, so robust testing definelty required. Sso this deserved a second look, proper package, proper testing to ensure integrity and reliabilty around a number of edge cases, primarily as most git users would guess: merging.

The plan is to deliver as an npm package, so it truly becomes yet-another command (w/o path fiddling).

## requirements

Presence of a sufficient node (≥v20) and git version (≥v2.2) is expected to be present (syncdocs doesn't install neither) and [checked on (every) script run](src/smokeCheck.js#L6).

## getting started


tbd

* getting package
* install/check node / git version
* mounting/samba
* default/user conf

## configuration

The “topology” here is very simply a „star“ with 1 central SHARE repo (in which you may indeed work, too!) and an arbitrary number of LOCAL repos. Where that “arbitrary” number might very well be 1, if you happen to have one desktop for home (as SHARE) and 1 laptop on the go. It's easy to later on add additional members.

your SHARE repo (in 1 single place, i.e. storage media on your NAS) needs to provide a `.syncshare.json`file with global settings relating to your entire system

→ if you are happy with [the default settings](./defaultConfig.json), e.g. for  `excludedExtensions`, `MAX_FILE_SIZE_MB`, it's sheer presence is enough (with or without empty curly brackets inside). Then it's just a marker file.

```json
{
  "excludedExtensions": [... ,
  "MAX_FILE_SIZE_MB": 30,
}
```

your LOCAL repo (on every one of your machines) however does need to provide a `.synclocal.json` file with EXACTLY these 2 entries:

```json
{
    machineName: os.hostname(), // what uname -n delivers, localRepo: '/home/user/'
    localRepo: 'mySyncDocsFolder', // again, ensuring the right  place
    shareRepo: '/fritzbox/usb-stick/SHARE' // the share repo to connect to
}
```

End of line comments with `//`, so called JSONC, are okay. Also “trailing commas” are no problem.

...

## disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
