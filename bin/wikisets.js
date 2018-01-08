#!/usr/bin/env node

/*
CLI script
*/

var vorpal = require("vorpal")()
var fs = require("fs")
var colors = require("colors")
var request = require("sync-request")
var wikisets = require("../lib/index.js")

var run_location = process.cwd()

if (fs.existsSync(run_location + "/_set.json") === true){
  var manifest = JSON.parse(fs.readFileSync(run_location + "/_set.json"))
}
else {
  console.log("Alert!".red + "\nNo set manifest file ('_set.json') was found in this directory. Either move to a directory where a set manifest file exists or create a new set. To do so, use the 'new' command.\nIf you want to create the new set in this current directory, simply use this command: 'new .' If you choose to do so, please simply restart Wikisets in the same directory to allow the program to load the proper files needed for it to run properly.")
}

vorpal
  .command("new <set directory>")
  .description("Create a new set")
  .action(function(args, callback) {
    wikisets.set.newSet(run_location + "/" + args["set directory"])
    callback()
  })

vorpal
  .command("sync")
  .description("Syncing manifest and downloaded articles")
  .action(function(args, callback) {
    wikisets.set.syncManifest(run_location, manifest)
    callback()
  })

vorpal
  .command("merge <merging manifest path>")
  .description("Merge a different set with your current one")
  .option("--no-sync", "Don't sync the combined manifest")
  .option("-u, --url", "Use the merging manifest path as a URL")
  .action(function(args, callback) {
    wikisets.version.bumpVersion(run_location, manifest)
    var merging_manifest
    if (args.options.url === true) {
      this.log("Loading data from passed URL")
      var res = request("GET", args["merging manifest path"])
      merging_manifest = JSON.parse(res.getBody())
    }
    else {
      this.log("Loading passed file path")
      merging_manifest = JSON.parse(fs.readFileSync(run_location + "/" + args["merging manifest path"]))
    } 
    wikisets.set.mergeManifests(run_location, manifest, merging_manifest)
    if (args.options["no-sync"] !== true) {
      this.log("Now syncing combined manifest")
      wikisets.set.syncManifest(run_location, manifest)
    }
    callback()
  })

vorpal
  .command("scrape <url>")
  .description("Scrape keywords and their given Wikipedia articles")
  .action(function(args, callback) {
    wikisets.version.bumpVersion(run_location, manifest)
    var keywords = wikisets.keywords.scrapeURL(args.url)
    for (var i=0; i<keywords.length; i++) {
      wikisets.wikipedia.search(keywords[i], function(result) {
        wikisets.set.addArticle(run_location, manifest, result.results[0])
      })
    }
    callback()
  })

vorpal
  .command("add <article name>")
  .description("Add a specific article to your set")
  .option("-v, --verbatim", "Use the given article name verbatim")
  .option("-m, --multi [limit]", "Download all articles fuzzy matching your query")
  .action(function(args, callback) {
    wikisets.version.bumpVersion(run_location, manifest)
    if (typeof args.options.verbatim !== "undefined" && typeof args.options.multi !== "undefined") {
      console.log("The verbatim and multi options can't both be used at once... Sorry!")
      callback()
      return
    }
    if (args.options.verbatim === true) {
      wikisets.set.addArticle(run_location, manifest, args["article name"])
      callback()
      return
    }
    var limit
    if (typeof args.options.multi !== "undefined") {
      limit = 9
      if (typeof args.options.multi === "number") {
        limit = args.options.multi - 1
      }
    }
    else {
      limit = 1
    }
    wikisets.wikipedia.search(args["article name"], function(result) {
      for (var i=0; i<limit; i++) {
        wikisets.set.addArticle(run_location, manifest, result.results[i])
      }
    })
    callback()
  })

vorpal
  .command("remove <article name>")
  .description("Remove a specific article from your set")
  .action(function (args, callback) {
    wikisets.version.bumpVersion(run_location, manifest)
    wikisets.set.removeArticle(run_location, manifest, args["article name"])
    callback()
  })

vorpal
  .command("undo")
  .description("Undo your last set edit")
  .action(function (args, callback) {
    wikisets.version.revertVersion(run_location, manifest)
    callback()
  })

vorpal
  .command("search <query>")
  .description("Search Wikipedia")
  .action(function(args, callback) {
    wikisets.wikipedia.search(args.query, function(result) {
      for (var i=0; i<result.results.length; i++) {
        console.log(result.results[i])
      }
    })
    callback()
  })

vorpal
  .command("contact")
  .description("Get developer's contact info")
  .action(function(args, callback) {
    this.log("Send me an email at " + "alexanderjwaitz@gmail.com".blue)
    this.log("Check out my Github at " + "https://github.com/alexwaitz".green)
    this.log("Submit a bug report at " + "https://github.com/alexwaitz/wikisets/issues".red)
    callback()
  })

console.log("Wikisets Started! Use the 'help' command to get started".green)

vorpal
  .delimiter("wikisets:".rainbow)
  .show()