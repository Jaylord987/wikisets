/*
Set Interfacing Functions
*/

var fs = require("fs")
var path = require("path")
var concat = require("unique-concat")

module.exports = function (wikisets) {
  wikisets.set = {
    newSet: function (directory) {
      console.log("Creating new set at " + directory)
      if (fs.existsSync(directory) === false) {
        fs.mkdirSync(directory)
      }
      var manifest_model = {
        name: "Insert this set's name",
        info: "Insert some info about this set",
        version: "0.0.0",
        articles: [
          
        ]
      }
      fs.writeFileSync(directory + "/_set.json", JSON.stringify(manifest_model, null, "\t"))
      wikisets.version.initGit(directory)
    },
    /*
    Only downloads data if it doesn't exist. Doesn't update already existing articles
    */
    syncManifest: function (directory, manifest) {
      for (var i=0; i<manifest.articles.length; i++) {
        var exist_status = fs.existsSync(directory + "/" + manifest.articles[i] + ".txt")
        if (exist_status === true) {
          console.log("'" + manifest.articles[i] + "' exists")
        }
        if (exist_status === false) {
          console.log("'" + manifest.articles[i] + "' doesn't exist. Downloading it right now")
          wikisets.wikipedia.getArticleData(manifest.articles[i], function(page) {
            page.content().then(function(content) {
              fs.writeFileSync(directory + "/" + page.raw.title + ".txt", content)
            })
          })
        }
      }
    },
    addArticle: function (directory, manifest, title) {
      wikisets.wikipedia.getArticleData(title, function(page) {
        console.log("Adding '" + title + "' to your set")
        page.content().then(function(content) {
          fs.writeFileSync(directory + "/" + page.raw.title + ".txt", content)
        })
      })
      if (manifest.articles.indexOf(title) === -1) {
        console.log("Updating manifest")
        manifest.articles.push(title)
        fs.writeFileSync(directory + "/" + "_set.json", JSON.stringify(manifest, null, "\t"))
      }
    },
    removeArticle: function (directory, manifest, title) {
      try {
        console.log("Removing '" + title + "'")
        fs.unlinkSync(directory + "/" + title + ".txt")
        manifest.articles.splice(manifest.articles.indexOf(title), 1)
        fs.writeFileSync(directory + "/" + "_set.json", JSON.stringify(manifest, null, "\t"))
      }
      catch (err) {
        console.log("'" + title + "' wasn't found")
      }
    },
    mergeManifests: function (directory, main_manifest, merging_manifest) {
      console.log("Combining and saving manifest")
      main_manifest.articles = concat(main_manifest.articles, merging_manifest.articles)
      fs.writeFileSync(directory + "/" + "_set.json", JSON.stringify(main_manifest, null, "\t"))
    }
  }
}