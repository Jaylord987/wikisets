/*
Versioning Tools
*/

var git = require("simple-git")(process.cwd())

module.exports = function (wikisets) {
  wikisets.version = {
    initGit: function (directory) {
      console.log("Initializing git (for versioning purposes)")
      git
        .init()
        .add([directory + "/_set.json"])
    }
  }
}