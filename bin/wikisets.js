#!/usr/bin/env node

/*
CLI script
*/

var vorpal = require("vorpal")()
var fs = require("fs")
var colors = require("colors")
var wikisets = require("../lib/index.js")

console.log("Wikisets Started! Use the 'help' command to get started".red)

var manifest = fs.readFileSync(process.cwd() + "/_set.json")
manifest = JSON.parse(manifest)

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

vorpal
  .delimiter("wikisets$".rainbow)
  .show()