# `new`

## Description
The `new` command is used to create a new set. Because each set is manifest based, this command simply writes out a manifest file and starts a git repo in the given directory. The git repo is used for the versioning commands. If the passed directory doesn't exist, it'll also be created.

## Usage
Create set in current directory: `new .`

Create set in `foo`: `new foo`