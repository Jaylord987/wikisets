/*
Versioning Tools
*/

var fs = require("fs")
var git = require("simple-git")(process.cwd())
var semver = require("semver")

module.exports = function (wikisets) {
  wikisets.version = {
    initGit: function (directory) {
      console.log("Initializing git (for versioning purposes)")
      git
        .cwd(directory)
        .init()
        .add(directory + "/_set.json")
    },
    versionIncrement: function (directory, manifest, increment) {
      console.log("Bumping your set by a '" + increment + "' increment")
      try {
        manifest.version = semver.inc(manifest.version, increment)
      }
      catch (err) {
        console.log("The passed increment isn't valid. The valid increments are 'major', 'minor', and 'patch'")
        return
      }
      fs.writeFileSync(directory + "/_set.json", JSON.stringify(manifest, null, "\t"))
      console.log("Commit git")
      git
        .add(directory + "/_set.json")
        .commit(manifest.version)
    }
  }
}