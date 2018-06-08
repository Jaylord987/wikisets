//modules
import fs from 'fs';
import path from 'path';
import concat from 'unique-concat';
import glob from 'glob';
import {default as Wikipedia} from 'wikijs';

//subclasses
import Version from './Version.js';
import Parser from './Parser.js';

class Wikisets {
  constructor(directory) {
    this.directory = directory;
    this.manifest = JSON.parse(fs.readFileSync(this.directory + '/_set.json', 'utf8'));

    this.Version = new Version();
    this.Parser = new Parser();
  }
  syncManifest(directory = this.directory, manifest = this.manifest) {
    return new Promise((resolve, reject) => {
      glob(directory + '/*' + manifest.extension, (err, files) => {
        for (let i=0; i<files.length; i++) {
          let article_name = files[i].replace(/^.*[\\\/]/, '');
          article_name = article_name.substring(0, article_name.length-4);
          if (manifest.articles.indexOf(article_name) === -1) {
          console.log('"' + article_name + '" is downloaded but isn\'t in your manifest. Deleting right now');
          fs.unlinkSync(files[i]);
          }
        }
        for (let i=0; i<manifest.articles.length; i++) {
          let exist_status = fs.existsSync(directory + '/' + manifest.articles[i] + manifest.extension);
          if (exist_status === true) {
            console.log('"' + manifest.articles[i] + '" exists');
          }
          if (exist_status === false) {
            console.log('"' + manifest.articles[i] + '" doesn\'t exist. Downloading it right now');
            Wikipedia()
              .page(manifest.articles[i])
              .then(page => page.content())
              .then((content) => {
                fs.writeFileSync(directory + '/' + manifest.articles[i] + manifest.extension, this.Parser.mediawikiToMarkdown(content));
              });
          }
        }
        resolve(manifest);
      });
    });
  }
  addArticle(title, directory = this.directory, manifest = this.manifest) {
    this.Version.bumpVersion(directory, manifest);
    return new Promise((resolve, reject) => {
      Wikipedia()
        .page(title)
        .then(page => page.content())
        .then((content) => {
          fs.writeFileSync(directory + '/' + title + manifest.extension, this.Parser.mediawikiToMarkdown(content))
          console.log(manifest)
          if (manifest.articles.indexOf(title) === -1) {
            console.log('Updating manifest');
            manifest.articles.push(title);
            fs.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
          }
        });
    });
  }
  removeArticle(title, directory = this.directory, manifest = this.manifest) {
    this.Version.bumpVersion(directory, manifest);
    return new Promise((resolve, reject) => {
      try {
        console.log('Removing "' + title + '"');
        fs.unlinkSync(directory + "/" + title + manifest.extension);
        manifest.articles.splice(manifest.articles.indexOf(title), 1);
        fs.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
        resolve(manifest);
      }
      catch (err) {
        console.log('"' + title + '" wasn\'t found');
        reject('Article not found in manifest');
      }
    })
  }
  mergeManifests(secondaryManifest, directory = this.directory, primaryManifest = this.manifest) {
    return new Promise((resolve, reject) => {
      console.log('Combining and saving manifest')
      primaryManifest.articles = concat(primaryManifest.articles, secondaryManifest.articles);
      fs.writeFileSync(directory + '/' + '_set.json', JSON.stringify(primaryManifest, null, '\t'));
      resolve(manifest);
    })
  }
  updateArticles(directory = this.directory, manifest = this.manifest) {
    return new Promise((resolve, reject) => {
      for (var i=0; i<manifest.articles.length; i++) {
        Wikipedia()
          .page(title)
          .then(page => page.content())
          .then((content) => {
            console.log('Updating "' + manifest.articles[i] + '"')
            fs.writeFileSync(directory + '/' + manifest.articles[i] + manifest.extension, this.Parser.mediawikiToMarkdown(content))
            resolve(manifest)
          });
      }
    })
  }
  repairManifest(directory = this.directory, manifest = this.manifest) {
    if (manifest.extension === undefined) {
      manifest.extension = '.txt'
    }
    if (manifest.articles === undefined) {
      manifest.articles = []
    }
    fs.writeFileSync(directory + '/_set.json', JSON.stringify(manifest, null, `\t`))
  }
}

let createSet = (directory) => {
  let model = {
    name: 'Insert this set\'s name',
    info: 'Insert some info about this set',
    history: true,
    extension: '.txt',
    articles: [
    ]
  }
  console.log('Creating new set at ' + directory);
  if (fs.existsSync(directory) === false) {
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(directory + '/_set.json', JSON.stringify(model, null, '\t'));
  let version = new Version();
  version.createHistoryManifest(directory);
}

export {Wikisets, createSet}