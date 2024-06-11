# syncdocs - “git client server” for end users

The idea being to sync personal data (text, pdf documents and invoices, screenshots, _not_ source code) between a central git repository and various workstations.

[![](https://mermaid.ink/img/pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA?type=png)](https://mermaid.live/edit#pako:eNqNjs8KgzAMh1-l5KSgL1DGQOZuYxd3W3cINv5h1kpsN4b67uvE4wYLhCQfHz8yQWk1gYSqs8-yQXbikqtehMoiBQXxgzg6Z0WsIN642KXpfh5ffTmLw7VCWWHa4eDsIE7ruH0R83_F40_x05CAITbY6vDztFJwDRlSIMOqke8KVL8ED72zRYgE6dhTAmx93UCI7sZw-UGjo7zFmtFsdHkDOqFXxA)

Sounds like something `git` would do out of the box, but:

* allow changes on both the central (typically NAS-mounted) repository (so it's not a dedicated _bare_ respository) and the clients
* have a single end-user friendly 'syncdocs' command, no decision to make, no merge conflicts to deal with²
  * ²yes, the price to pay: collisions shall be rare, in case both versions are preserved in version history, the more central one “wins” as the latter version
* yet benefit of git`s smart automerge capabilities on plain text files, rename detection, correct metadata (who commited which document when) and versioning elegance

## prerequisites

This initially developed as a shell script, but things got more tricky, so this derserves a proper package and proper testing to ensure integrity.

The plan is to deliver as an npm package