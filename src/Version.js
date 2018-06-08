import fs from 'fs';

/**
 * Version subclass constructor
 * @class
 * @example
 * wikiset.Version.insertMethodHere();
 * //or
 * let version = new Version();
 */
class Version {
  constructor() {
    this.model = {
      history: [
        
      ]
    }
  }
  /**
   * Create a new history manifest
   * @method
   * @example
   * wikiset.Version.createHistoryManifest(wikiset.directory);
   * //or
   * version.createHistoryManifest("./set");
   * 
   * @param {string} directory - Where to create the history manifest
   * @returns {promise} Promise resolves with the manifest
   */
  createHistoryManifest(directory) {
    return new Promise((resolve, reject) => {
      console.log('Creating history manifest');
      fs.writeFileSync(directory + '/_set-history.json', JSON.stringify(this.model, null, '\t'));
      resolve(directory);
    });
  }
  /**
   * Add a new version to a history manifest
   * @method
   * @example
   * wikiset.Version.bumpVersion(wikiset.directory, wikiset.manifest);
   * //or
   * version.bumpVersion("./set", manifest);
   * 
   * @param {string} directory - Location of history manifest
   * @param {object} manifest - Set manifest to use
   * @returns {promise} Promise resolves with the manifest, rejects with an error message
   */
  bumpVersion(directory, manifest) {
    return new Promise((resolve, reject) => {
      if (manifest.history === true) {
        let historyManifest = JSON.parse(fs.readFileSync(directory + '/_set-history.json'));
        let historyEntryModel = {
          timestamp: new Date,
          manifest: manifest
        }
        historyManifest.history.push(historyEntryModel);
        fs.writeFileSync(directory + '/_set-history.json', JSON.stringify(historyManifest, null, '\t'));
        resolve(manifest);
      }
      if (manifest.history === false) {
        console.log('Looks like "history" is set to false in your manifest file. Change it to true to enable history functions');
        reject('The "history" attribute in your manifest file has been set to false');
      }
    });
  }
  /**
   * Reverts to the previous version of the set manifest
   * @method
   * @example
   * wikiset.Version.revertVersion(wikiset.directory, wikiset.manifest);
   * //or
   * version.revertVersion("./set", manifest);
   * 
   * @param {string} directory - Location of history manifest
   * @param {object} manifest - Set manifest to use
   * @returns {promise} Promise resolves with the manifest, rejects with an error message
   */
  revertVersion(directory, manifest) {
    return new Promise((resolve, reject) => {
      if (manifest.history === true) {
        let historyManifest = JSON.parse(fs.readFileSync(directory + '/_set-history.json'));
        manifest = historyManifest.history[historyManifest.history.length-1].manifest;
        historyManifest.history.pop();
        fs.writeFileSync(directory + '/_set.json', JSON.stringify(manifest, null, '\t'));
        fs.writeFileSync(directory + '/_set-history.json', JSON.stringify(historyManifest, null, '\t'));
        resolve(manifest);
      }
      if (manifest.history === false) {
        console.log('Looks like the "history" is set to false in your manifest file. Change it to true to enable history functions');
        reject('The "history" attribute in your manifest file has been set to false');
      }
    });
  }
}

export default Version;