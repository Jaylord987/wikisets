/*
Set Interfacing Functions
*/

var fs = require("fs")
var path = require("path")
var concat = require("unique-concat")
var glob = require("glob")

module.exports = function (wikisets) {
  wikisets.set = {
    manifest_model: {
      name: "Insert this set's name",
      info: "Insert some info about this set",
      history: true,
      extension: ".txt",
      articles: [
      ]
    },
    newSet: function (directory) {
      console.log("Creating new set at " + directory)
      if (fs.existsSync(directory) === false) {
        fs.mkdirSync(directory)
      }
      fs.writeFileSync(directory + "/_set.json", JSON.stringify(this.manifest_model, null, "\t"))
      wikisets.version.newHistoryManifest(directory)
    },
    /*
    Only downloads data if it doesn't exist. Doesn't update already existing articles. If there's a text file that exists but doesn't have an item in the manifest, it'll be removed
    */
    syncManifest: function (directory, manifest) {
      glob(directory + "/*" + manifest.extension, function (err, files) {
        for (var i=0; i<files.length; i++) {
          var article_name = files[i].replace(/^.*[\\\/]/, '')
          article_name = article_name.substring(0, article_name.length-4)
          if (manifest.articles.indexOf(article_name) === -1) {
            console.log("'" + article_name + "' is downloaded but isn't in your manifest. Deleting right now")
            fs.unlinkSync(files[i])
          }
        }
        for (var i=0; i<manifest.articles.length; i++) {
          var exist_status = fs.existsSync(directory + "/" + manifest.articles[i] + manifest.extension)
          if (exist_status === true) {
            console.log("'" + manifest.articles[i] + "' exists")
          }
          if (exist_status === false) {
            console.log("'" + manifest.articles[i] + "' doesn't exist. Downloading it right now")
            wikisets.wikipedia.getArticleData(manifest.articles[i], function(page) {
              page.content().then(function(content) {
                fs.writeFileSync(directory + "/" + page.raw.title + manifest.extension, wikisets.parser.mediawikiToMarkdown(content))
              })
            })
          }
        }
      })
    },
    addArticle: function (directory, manifest, title) {
      wikisets.wikipedia.getArticleData(title, function(page) {
        console.log("Adding '" + title + "' to your set")
        page.content().then(function(content) {
          fs.writeFileSync(directory + "/" + page.raw.title + manifest.extension, wikisets.parser.mediawikiToMarkdown(content))
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
        fs.unlinkSync(directory + "/" + title + manifest.extension)
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
    },
    updateArticles: function (directory, manifest) {
      for (var i=0; i<manifest.articles.length; i++) {
        wikisets.wikipedia.getArticleData(manifest.articles[i], function(page) {
          console.log("Updating '" + page.raw.title + "'")
          page.content().then(function(content) {
            fs.writeFileSync(directory + "/" + page.raw.title + manifest.extension, wikisets.parser.mediawikiToMarkdown(content))
          })
        })
      }
    },
    /*
    This function only repairs segments deemed crucial. Anything that's not super important won't be repaired (e.g. name & info)
    */
    repairManifest: function (directory, manifest) {
      if (manifest.extension === undefined) {
        manifest.extension = ".txt"
      }
      if (manifest.articles === undefined) {
        manifest.articles = []
      }
      fs.writeFileSync(directory + "/set.json")
    }
  }
}