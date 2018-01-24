/*
Versioning Tools
*/

var fs = require("fs")

module.exports = function (wikisets) {
  wikisets.version = {
    newHistoryManifest: function(directory) {
      console.log("Creating history manifest")
      var history_manifest_model = {
        history: [
        ]
      }
      fs.writeFileSync(directory + "/_set-history.json", JSON.stringify(history_manifest_model, null, "\t"))
    },
    bumpVersion: function(directory, manifest) {
      if (manifest.history === true) {
        history_manifest = JSON.parse(fs.readFileSync(directory + "/_set-history.json"))
        history_item_model = {
          timestamp: new Date,
          manifest: manifest
        }
        history_manifest.history.push(history_item_model)
        fs.writeFileSync(directory + "/_set-history.json", JSON.stringify(history_manifest, null, "\t"))
      }
      if (manifest.history === false) {
        console.log("Looks like the 'history' is set to false in your manifest file. Change it to true to enable history functions")
      }
    },
    revertVersion: function(directory, manifest) {
      if (manifest.history === true) {
        history_manifest = JSON.parse(fs.readFileSync(directory + "/_set-history.json"))
        manifest = history_manifest.history[history_manifest.history.length-1].manifest
        history_manifest.history.pop()
        fs.writeFileSync(directory + "/_set.json", JSON.stringify(manifest, null, "\t"))
        fs.writeFileSync(directory + "/_set-history.json", JSON.stringify(history_manifest, null, "\t"))
        wikisets.set.syncManifest(directory, manifest)
      }
      if (manifest.history === false) {
        console.log("Looks like the 'history' is set to false in your manifest file. Change it to true to enable history functions")
      }
    }
  }
}