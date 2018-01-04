/*
Set Interfacing Functions
*/

var fs = require("fs")
var path = require("path")

module.exports = function (wikisets) {
  wikisets.set = {
    new: function (directory) {
      if (fs.existsSync(directory) === false) {
        fs.mkdirSync(directory)
      }
      var manifest_model = {
        name: "My Offline Wikipeida Set",
        articles: [
          
        ]
      }
      fs.writeFileSync(directory + "/_set.json", JSON.stringify(manifest_model, null, "\t"))
      console.log("New set created at " + directory)
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
        page.content().then(function(content) {
          fs.writeFileSync(directory + "/" + page.raw.title + ".txt", content)
          console.log("'" + title + "' has been added to your set")
        })
      })
      if (manifest.articles.indexOf(title) === -1) {
        manifest.articles.push(title)
        fs.writeFileSync(directory + "/" + "_set.json", JSON.stringify(manifest, null, "\t"))
        console.log("'_set.json' has been updated")
      }
    },
    removeArticle: function (directory, manifest, title) {
      try {
        fs.unlinkSync(directory + "/" + title + ".txt")
        manifest.articles.splice(manifest.articles.indexOf(title), 1)
        fs.writeFileSync(directory + "/" + "_set.json", JSON.stringify(manifest, null, "\t"))
        console.log("'" + title + "' has been removed")
      }
      catch (err) {
        console.log("'" + title + "' wasn't found")
      }
    }
  }
}