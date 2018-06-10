'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Version subclass constructor
 * @class
 * @example
 * wikiset.Version.insertMethodHere();
 * //or
 * let version = new Version();
 */
var Version = function () {
  function Version() {
    _classCallCheck(this, Version);

    this.model = {
      history: []
    };
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


  _createClass(Version, [{
    key: 'createHistoryManifest',
    value: function createHistoryManifest(directory) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _fs2.default.writeFileSync(directory + '/_set-history.json', JSON.stringify(_this.model, null, '\t'));
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

  }, {
    key: 'bumpVersion',
    value: function bumpVersion(directory, manifest) {
      return new Promise(function (resolve, reject) {
        if (manifest.history === true) {
          var historyManifest = JSON.parse(_fs2.default.readFileSync(directory + '/_set-history.json'));
          var historyEntryModel = {
            timestamp: new Date(),
            manifest: manifest
          };
          historyManifest.history.push(historyEntryModel);
          _fs2.default.writeFileSync(directory + '/_set-history.json', JSON.stringify(historyManifest, null, '\t'));
          resolve(manifest);
        }
        if (manifest.history === false) {
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

  }, {
    key: 'revertVersion',
    value: function revertVersion(directory, manifest) {
      return new Promise(function (resolve, reject) {
        if (manifest.history === true) {
          var historyManifest = JSON.parse(_fs2.default.readFileSync(directory + '/_set-history.json'));
          manifest = historyManifest.history[historyManifest.history.length - 1].manifest;
          historyManifest.history.pop();
          _fs2.default.writeFileSync(directory + '/_set.json', JSON.stringify(manifest, null, '\t'));
          _fs2.default.writeFileSync(directory + '/_set-history.json', JSON.stringify(historyManifest, null, '\t'));
          resolve(manifest);
        }
        if (manifest.history === false) {
          reject('The "history" attribute in your manifest file has been set to false');
        }
      });
    }
  }]);

  return Version;
}();

exports.default = Version;