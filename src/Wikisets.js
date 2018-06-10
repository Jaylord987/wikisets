//modules
import fs from 'fs';
import concat from 'unique-concat';
import glob from 'glob';
import {default as Wikipedia} from 'wikijs';

//subclasses
import Version from './Version.js';
import Parser from './Parser.js';

/**
 * Wikisets constructor
 * @class
 * @example
 * let wikiset = new Wikisets('./my_set_dir');
 * 
 * @param {string} directory - Set's directory path
 */
class Wikisets {
  constructor(directory) {
    this.directory = directory;
    this.manifest = JSON.parse(fs.readFileSync(this.directory + '/_set.json', 'utf8'));

    this.Version = new Version();
    this.Parser = new Parser();
  }
  /**
   * Sync the downloaded articles with the listed articles in the manifest
   * @method
   * @example
   * wikiset.syncManifest();
   * 
   * @param {string} [directory=wikiset.directory] - Directory for the operation, by deafult is the one stored in the object
   * @param {object} [manifest=wikiset.manifest] - Manifest for the operation, by deafult is the one stored in the object
   * @returns {promise} Promise resolves with the manifest
   */
  syncManifest(directory = this.directory, manifest = this.manifest) {
    return new Promise((resolve, reject) => {
      glob(directory + '/*' + manifest.extension, (err, files) => {
        for (let i=0; i<files.length; i++) {
          let article_name = files[i].replace(/^.*[\\\/]/, '');
          article_name = article_name.substring(0, article_name.length-4);
          if (manifest.articles.indexOf(article_name) === -1) {
          fs.unlinkSync(files[i]);
          }
        }
        for (let i=0; i<manifest.articles.length; i++) {
          let exist_status = fs.existsSync(directory + '/' + manifest.articles[i] + manifest.extension);
          if (exist_status === true) {
          }
          if (exist_status === false) {
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
  /**
   * Add an article to a set
   * @method
   * @example
   * wikiset.addArticle('Jazz');
   * 
   * @param {string} title - Title of the Wikipedia page
   * @param {string} [directory=wikiset.directory] - Directory for the operation, by deafult is the one stored in the object
   * @param {object} [manifest=wikiset.manifest] - Manifest for the operation, by deafult is the one stored in the object
   * @returns {promise} Promise resolves with the manifest
   */
  addArticle(title, directory = this.directory, manifest = this.manifest) {
    this.Version.bumpVersion(directory, manifest);
    return new Promise((resolve, reject) => {
      Wikipedia()
        .page(title)
        .then(page => page.content())
        .then((content) => {
          if (manifest.articles.indexOf(title) === -1) {
            manifest.articles.push(title);
            fs.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
          }
        });
    });
  }
  /**
   * Remove an article from a set
   * @method
   * @example
   * wikiset.removeArticle('Jazz');
   * 
   * @param {string} title - Title of the page in the set
   * @param {string} [directory=wikiset.directory] - Directory for the operation, by deafult is the one stored in the object
   * @param {object} [manifest=wikiset.manifest] - Manifest for the operation, by deafult is the one stored in the object
   * @returns {promise} Resolves with the manifest, rejcts with an error message
   */
  removeArticle(title, directory = this.directory, manifest = this.manifest) {
    this.Version.bumpVersion(directory, manifest);
    return new Promise((resolve, reject) => {
      try {
        fs.unlinkSync(directory + "/" + title + manifest.extension);
        manifest.articles.splice(manifest.articles.indexOf(title), 1);
        fs.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
        resolve(manifest);
      }
      catch (err) {
        reject('Article not found in manifest');
      }
    })
  }
  /**
   * Merge a manifest with a primary one
   * @method
   * @example
   * wikiset.mergeManifests(secondaryManifest);
   * 
   * @param {object} secondaryManifest - Manifest to be merged with main
   * @param {string} [directory=wikiset.directory] - Directory for the operation, by deafult is the one stored in the object
   * @param {object} [manifest=wikiset.manifest] - Manifest for the operation, by deafult is the one stored in the object
   * @returns {promise} Promise resolves with the manifest
   */
  mergeManifests(secondaryManifest, directory = this.directory, primaryManifest = this.manifest) {
    return new Promise((resolve, reject) => {
      primaryManifest.articles = concat(primaryManifest.articles, secondaryManifest.articles);
      fs.writeFileSync(directory + '/' + '_set.json', JSON.stringify(primaryManifest, null, '\t'));
      resolve(manifest);
    })
  }
  /**
   * Update all the articles' contents
   * @method
   * @example
   * wikiset.updateArticles();
   * 
   * @param {string} [directory=wikiset.directory] - Directory for the operation, by deafult is the one stored in the object
   * @param {object} [manifest=wikiset.manifest] - Manifest for the operation, by deafult is the one stored in the object
   * @returns {promise} Promise resolves with the manifest
   */
  updateArticles(directory = this.directory, manifest = this.manifest) {
    return new Promise((resolve, reject) => {
      for (var i=0; i<manifest.articles.length; i++) {
        Wikipedia()
          .page(title)
          .then(page => page.content())
          .then((content) => {
            fs.writeFileSync(directory + '/' + manifest.articles[i] + manifest.extension, this.Parser.mediawikiToMarkdown(content))
            resolve(manifest)
          });
      }
    })
  }
  /**
   * Repairing any fatal manifest issues
   * @method
   * @example
   * wikiset.repairManifest();
   * 
   * @param {string} [directory=wikiset.directory] - Directory for the operation, by deafult is the one stored in the object
   * @param {object} [manifest=wikiset.manifest] - Manifest for the operation, by deafult is the one stored in the object
   */
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

/**
 * Create a new set
 * @function
 * @example
 * createSet('./set');
 * 
 * @param {string} directory - Directory path for set creation
 */
let createSet = (directory) => {
  let model = {
    name: 'Insert this set\'s name',
    info: 'Insert some info about this set',
    history: true,
    extension: '.txt',
    articles: [
    ]
  }
  if (fs.existsSync(directory) === false) {
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(directory + '/_set.json', JSON.stringify(model, null, '\t'));
  let version = new Version();
  version.createHistoryManifest(directory);
}

export {Wikisets, createSet}