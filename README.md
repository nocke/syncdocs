# syncdocs - “git client server” for end users

The idea being to sync personal data (text, pdf documents and invoices, screenshots, _not_ source code) between a central git repository and various workstations.

Sounds like something `git` does out of the box, but:
• allow changes on both the central (typically NAS-mounted) repository (so it's not a dedicated _bare_ respository) and the clients
• have a single end-user friendly 'syncdocs' command, no decision to make.
  • collisions shall be rare, in case both versions are preserved in version history, the more central one “wins” as the latter version

## prerequisites

This initially developed as a shell script, but things got more tricky, so this derserves a proper package and proper testing to ensure integrety.

