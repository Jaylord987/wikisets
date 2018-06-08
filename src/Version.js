import fs from 'fs';

class Version {
  constructor() {
    this.model = [
    ]
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
        history_manifest = JSON.parse(fs.readFileSync(directory + '/_set-history.json'));
        history_item_model = {
          timestamp: new Date,
          manifest: manifest
        }
        history_manifest.history.push(history_item_model);
        fs.writeFileSync(directory + '/_set-history.json', JSON.stringify(history_manifest, null, '\t'));
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
        history_manifest = JSON.parse(fs.readFileSync(directory + '/_set-history.json'));
        manifest = history_manifest.history[history_manifest.history.length-1].manifest;
        history_manifest.history.pop();
        fs.writeFileSync(directory + '/_set.json', JSON.stringify(manifest, null, '\t'));
        fs.writeFileSync(directory + '/_set-history.json', JSON.stringify(history_manifest, null, '\t'));
        wikisets.set.syncManifest(directory, manifest);
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