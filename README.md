# syncdocs

[![Syncdocs version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnocke%2Fsyncdocs%2Fmaster%2Fpackage.json&query=version&label=Syncdocs%20Version&color=%230f80ff&link=https%3A%2F%2Fgithub.com%2Fnocke%2Fsyncdocs%2Fblob%2Fmaster%2Fpackage.json%23L3)](https://github.com/nocke/syncdocs/blob/master/package.json#L3)
[![nocke syncdocs tests](https://img.shields.io/github/actions/workflow/status/nocke/syncdocs/node20.yml)](https://github.com/nocke/syncdocs/actions)

### extremly simplified git versioning for non-technical users. <br>_“surviving your daily flood of bureaucratic cruft”_

<img src="./docs/img/syncDocsCover.jpg" alt="SyncDocs Cover Image" style="width: 100%; height: auto;">

> `syncdocs` is **<ins>not</ins>** a tool to maintain any particular states of source code. (That's what `git` does...)
>
> This is a tool, that helks handling those incoming, ever-growing documents (i.e. invoices, notes, pdfs, bureaucractic cruft) in one central place, yet also decentralized, with offline access and syncing as a nobrainer.
>
> `syncdocs` has 1 end-user friendly command with 0 parameters to use. As much as I love git, no commit|pull|push|rebase and certainly no resolve-merge-conflicts makes things much easier for end users. Yet, it does harnesses many benefits of regular `git` use:
> * very easy syncing
> * versioning of course
> * largely conflict-free merges
> * rename detection (quite a feature actually!)
> * smart merging of anything plain-text (something-added-here vs. something-added-there in the same file will go together as you may expect)
> * some opinionated-ness, when non-text file changes collide (PDFs, images, …). spoiler: both versions will make it into recoverably version history)
> * recoverability (it doesn't matter if your server or client get's stolen or destroyed, as long as the-other-side is still around)
> * no system/platform/vendor-lock (all files are still in plain sight, in your file system, in a valid git repository, not buried in some fragile database, somewhere in the cloud, …)

    > syncdocs
    TBD
    ▁

## technical view

The idea being to sync personal data (text, pdf documents and invoices, screenshots, _not_ source code) between a central git repository (_actively usable_, not "bare", so truly peer-to-peer, which does brings some technical issues…) and various workstations with regular _client repos_

The idea being that your family members can also add stuff offline, i.e. on the road, and it all eventually ends up everywhere...

[![](https://mermaid.ink/img/pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA?type=png)](https://mermaid.live/edit#pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA)

**Sounds like something `git` would do out of the box anyhow? Yeah, but...**

* central repo is editable, too, _not_ a pure-server “bare repo”
* **end-users get a single, zero-param `syncdocs` command, no pull, no add, no commit, no push, never to bother with merge conflicts**
* collisions in given usage scenarios shall be rare (it's mostly about adding cruft), but will occur: in which case _both_ versions are preserved in version history: the more central one “wins” as the latter version, the other one preserved underneath
* it's still valid git repos on all ends (no vendor/platform lock-in), so you can add/integrate further things (i.e. commit hooks to the server), or analyse/retrieve elder versions with regular git tools like my favourite, [smartgit](https://www.syntevo.com/smartgit/).

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
...

## disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
