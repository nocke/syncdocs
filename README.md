# syncdocs

[![neopic version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnocke%2Fsyncdocs%2Fmaster%2Fpackage.json&query=version&label=syncdocs%20version)](https://github.com/nocke/neopic/releases/latest)
![nocke syncdocs tests](https://img.shields.io/github/actions/workflow/status/nocke/syncdocs/node20.yml?label=tests%20under%20node.js%2020&link=https%3A%2F%2Fgithub.com%2Fnocke%2Fsyncdocs%2Factions)

### – “extremly simplified git versioning for you your family members. <br>surviving your daily flood of bureaucratic cruft…”

<img src="./docs/img/syncDocsCover.jpg" alt="SyncDocs Cover Image" style="width: 100%; height: auto;">


> `syncdocs` is **<ins>not</ins>** a tool to maintain any particular states of source code. (That's what `git` does...) This is a tool, to gather incoming, growing documents (i.e. invoices, notes, pdfs, all that bureaucractic cruft over the year) in one central place, yet allowing simple decentralized, also offline access.
>
> While being end-user friendly with 1 parameter-free simple command, it harnesses a number of benefits of `git`: versioning of course, rename detection, largely conflict-free merges when adding to your text-based notes, version stacking on your binary ones, recoverability (it doesn't matter if your server or client get's stolen/destroy, as long as the other side is still around), no platform-lock (it's all stil valid git repos…)

    > syncdocs

    ▁

## technical view

The idea being to sync personal data (text, pdf documents and invoices, screenshots, _not_ source code) between a central git repository (_actively usable_, not "bare", so truly peer-to-peer, which brings some complications) and various workstations with somewhat more common _client repos_

The idea being that your family members can also add stuff offline, i.e. on the road, and it all eventually ends up everywhere...

[![](https://mermaid.ink/img/pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA?type=png)](https://mermaid.live/edit#pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA)

**Sounds like something `git` would do out of the box, but...**

* central repo is editable, too, not a pure-server “bare repo”
* end-users get a single, zero-param `syncdocs` command, no pull, no add, no commit, no push, never to bother with merge conflicts
* for given usage scenarios collisions shall be rare (it's mostly about adding cruft), but in which case _both_ versions are preserved in version history: the more central one “wins” as the latter version, the other one preserved underneath
* it's still all valid git repos (no vendor/platform lock-in), so you can add further things (i.e. commit hooks to the server), or analyse/retrieve elder versions with regular git tools like my favourite, [smartgit](https://www.syntevo.com/smartgit/).

## author

Frank Nocke

## development

This initially developed as a shell script, but things got a bit more tricky resp. robust testing got more crucial, so this deserved a proper package and proper testing to ensure integrity and be certain on a number of edge cases, mostly around (as a `git` user you guessed it:) merging.

The plan is to deliver as an npm package.

## requirements

Presence of a sufficient node (≥v20) and git version (≥v2.2) is expected to be present (syncdocs doesn't install neither) and checked on (every) script run.

## getting started

tbd

* getting package
* install/check node / git version
* mounting/samba
* default/user conf
...
