import fs from 'fs';

class Version {
  constructor() {
    this.model = {
      history: [
        
      ]
    }
  }
  createHistoryManifest(directory) {
    return new Promise((resolve, reject) => {
      console.log('Creating history manifest');
      fs.writeFileSync(directory + '/_set-history.json', JSON.stringify(this.model, null, '\t'));
      resolve(directory);
    });
  }
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