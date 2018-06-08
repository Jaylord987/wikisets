#!/usr/bin/env node

var vorpal = require('vorpal')();
var fs = require('fs');
var colors = require('colors');
var request = require('sync-request');
var Case = require('case');
var Wikipedia = require('wikijs').default;
var {Wikisets, createSet} = require('../dist/Wikisets.js');

const runLocation = process.cwd();

if (fs.existsSync(runLocation + '/_set.json') === true) {
  var wikisets = new Wikisets(runLocation);
  wikisets.repairManifest();
}
else {
  console.log('Alert!'.red + '\nNo set manifest file ("_set.json") was found in this directory. Either move to a directory where a set manifest file exists or create a new set. To do so, use the "new" command.\nIf you want to create the new set in this current directory, simply use this command: "new ." If you choose to do so, please simply restart Wikisets in the same directory to allow the program to load the proper files needed for it to run properly.');
}

vorpal
  .command('new <set directory>')
  .description('Create a new set')
  .action((args, callback) => {
    createSet(runLocation + '/' + args['set directory']);
    callback();
  });

vorpal
  .command('sync')
  .description('Syncing manifest and downloaded articles')
  .action((args, callback) => {
    wikisets.syncManifest().then(callback());
  });

vorpal
  .command('merge <merging manifest path>')
  .description('Merge a different set with your current one')
  .option('--no-sync', 'Don\'t sync the combined manifest')
  .option('-u, --url', 'Use the merging manifest path as a URL')
  .action((args, callback) => {
    var merging_manifest;
    if (args.options.url === true) {
      console.log('Loading data from passed URL');
      var res = request('GET', args['merging manifest path']);
      merging_manifest = JSON.parse(res.getBody());
    }
    else {
      console.log('Loading passed file path');
      merging_manifest = JSON.parse(fs.readFileSync(runLocation + '/' + args['merging manifest path']));
    }
    wikisets.mergeManifests(merging_manifest).then(() => {
      if (args.options['no-sync'] !== true) {
        console.log('Now syncing combined manifest');
        wikisets.syncManifest().then(callback());
      }
    });
  });

vorpal
  .command('add <article name>')
  .description('Add a specific article to your set')
  .option('-v, --verbatim', 'Use the given article name verbatim')
  .option('-m, --multi [limit]', 'Download all articles fuzzy matching your query')
  .action((args, callback) => {
    if (args.options.verbatim === true) {
      wikisets.addArticle(args['article name']);
      callback();
      return;
    }
    args['article name'] = Case.title(args['article name']);
    var limit;
    if (typeof args.options.multi !== 'undefined') {
      limit = 9;
    }
    if (typeof args.options.multi === 'number') {
      limit = args.options.multi - 1;
    }
    else {
      limit = 1;
    }
    if (typeof args.options.verbatim !== 'undefined' && typeof args.options.multi !== 'undefined') {
      console.log('The verbatim and multi options can\'t both be used at once');
      callback();
      return;
    }
    Wikipedia()
      .search(args['article name'])
      .then(function(result) {
        for (var i=0; i<limit; i++) {
          wikisets.addArticle(result.results[i]);
        }
      })
      .then(callback());
  });

vorpal
  .command('remove <article name>')
  .alias('rm')
  .description('Remove a specific article from your set')
  .action((args, callback) => {
    args['article name'] = Case.title(args['article name']);
    wikisets.removeArticle(args['article name'])
      .then(callback());
  });

vorpal
  .command('update')
  .description('Update all your articles\' content')
  .action((args, callback) => {
    wikisets.updateArticles()
      .then(callback());
  });

vorpal
  .command('undo')
  .description('Undo your last set edit')
  .action((args, callback) => {
    wikisets.Version.revertVersion(wikisets.directory, wikisets.manifest)
      .then(callback());
  });

vorpal
  .command('list')
  .alias('ls')
  .description('List all the articles in your set')
  .action((args, callback) => {
    for (var i=0; i<wikisets.manifest.articles.length; i++){
      console.log((i+1) + ': ' + wikisets.manifest.articles[i]);
    }
    callback();
  });

vorpal
  .command('search <query>')
  .description('Search Wikipedia')
  .action((args, callback) => {
    Wikipedia()
      .search(args.query)
      .then(function(result) {
        for (var i=0; i<result.results.length; i++) {
          console.log(result.results[i]);
        }
        callback();
      });
  });

vorpal
  .command('contact')
  .description('Get developer\'s contact info')
  .action((args, callback) => {
    console.log('Send me an email at ' + 'alexanderjwaitz@gmail.com'.blue);
    console.log('Check out my Github at ' + 'https://github.com/alexwaitz'.green);
    console.log('Submit a bug report at ' + 'https://github.com/alexwaitz/wikisets/issues'.red);
    callback();
  });

console.log('Wikisets Started! Use the "help" command to get started'.green);

vorpal
  .delimiter('wikisets:'.rainbow)
  .show();