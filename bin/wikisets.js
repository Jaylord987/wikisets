#!/usr/bin/env node

/*
CLI script
*/

var vorpal = require("vorpal")()
var fs = require("fs")
var colors = require("colors")
var wikisets = require("../lib/index.js")

if (fs.existsSync(process.cwd() + "/_set.json") === true){
  var manifest = JSON.parse(fs.readFileSync(process.cwd() + "/_set.json"))
}
else {
  console.log("Alert!".red + "\nNo set manifest file ('_set.json') was found in this directory. Either move to a directory where a set manifest file exists or create a new set. To do so, use the 'new' command.\nIf you want to create the new set in this current directory, simply use this command: 'new .'")
}

vorpal
  .command("new <set directory>")
  .description("Create a new set")
  .action(function(args, callback) {
    wikisets.set.new(process.cwd() + "/" + args["set directory"])
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
  .command("add <article name>")
  .description("Add a specific article to your set")
  .option("-v, --verbatim", "Use this article name verbatim")
  .action(function(args, callback) {
    if (args.options.verbatim === true) {
      wikisets.set.addArticle(process.cwd(), manifest, args["article name"])
    }
    else {
      wikisets.wikipedia.search(args["article name"], function(result) {
        wikisets.set.addArticle(process.cwd(), manifest, result.results[0])
      })
    }
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
  .description("Function to search wiki")
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
  .delimiter("wikisets$".rainbow)
  .show()