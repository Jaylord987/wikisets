#!/usr/bin/env node

/*
CLI script
*/

var vorpal = require("vorpal")()
var fs = require("fs")
var colors = require("colors")
var request = require("sync-request")
var wikisets = require("../lib/index.js")

if (fs.existsSync(process.cwd() + "/_set.json") === true){
  var manifest = JSON.parse(fs.readFileSync(process.cwd() + "/_set.json"))
}
else {
  console.log("Alert!".red + "\nNo set manifest file ('_set.json') was found in this directory. Either move to a directory where a set manifest file exists or create a new set. To do so, use the 'new' command.\nIf you want to create the new set in this current directory, simply use this command: 'new .' If you choose to do so, please simply restart Wikisets in the same directory to allow the program to load the proper files needed for it to run properly.")
}

vorpal
  .command("new <set directory>")
  .description("Create a new set")
  .action(function(args, callback) {
    wikisets.set.newSet(process.cwd() + "/" + args["set directory"])
    callback()
  })

vorpal
  .command("sync")
  .description("Syncing manifest and downloaded articles")
  .action(function(args, callback) {
    wikisets.set.syncManifest(process.cwd(), manifest)
    callback()
  })

vorpal
  .command("merge <merging manifest path>")
  .description("Merge a different set with your current one")
  .option("--no-sync", "Don't sync the combined manifest")
  .option("-u, --url", "Use the merging manifest path as a URL")
  .action(function(args, callback) {
    var merging_manifest
    if (args.options.url === true) {
      this.log("Loading data from passed URL")
      var res = request("GET", args["merging manifest path"])
      merging_manifest = JSON.parse(res.getBody())
    }
    else {
      this.log("Loading passed file path")
      merging_manifest = JSON.parse(fs.readFileSync(process.cwd() + "/" + args["merging manifest path"]))
    } 
    wikisets.set.mergeManifests(process.cwd(), manifest, merging_manifest)
    this.log("Now syncing combined manifest")
    if (args.options["no-sync"] !== true) {
      wikisets.set.syncManifest(process.cwd(), manifest)
    }
    callback()
  })

vorpal
  .command("add <article name>")
  .description("Add a specific article to your set")
  .option("-v, --verbatim", "Use the given article name verbatim")
  .option("-m, --multi [limit]", "Download all articles fuzzy matching your query")
  .action(function(args, callback) {
    if (typeof args.options.verbatim !== "undefined" && typeof args.options.multi !== "undefined") {
      console.log("The verbatim and multi options can't both be used at once... Sorry!")
      callback()
      return
    }
    if (args.options.verbatim === true) {
      wikisets.set.addArticle(process.cwd(), manifest, args["article name"])
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
      limit = 0
    }
    wikisets.wikipedia.search(args["article name"], function(result) {
      for (var i=0; i<limit; i++) {
        wikisets.set.addArticle(process.cwd(), manifest, result.results[i])
      }
    })
    callback()
  })

vorpal
  .command("remove <article name>")
  .description("Remove a specific article from your set")
  .action(function (args, callback) {
    wikisets.set.removeArticle(process.cwd(), manifest, args["article name"])
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

console.log("Wikisets Started! Use the 'help' command to get started".green)

vorpal
  .delimiter("wikisets:".rainbow)
  .show()