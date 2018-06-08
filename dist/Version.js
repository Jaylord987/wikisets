'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Version = function () {
  function Version() {
    _classCallCheck(this, Version);

    this.model = [];
  }

  _createClass(Version, [{
    key: 'createHistoryManifest',
    value: function createHistoryManifest(directory) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        console.log('Creating history manifest');
        _fs2.default.writeFileSync(directory + '/_set-history.json', JSON.stringify(_this.model, null, '\t'));
        resolve(directory);
      });
    }
  }, {
    key: 'bumpVersion',
    value: function bumpVersion(directory, manifest) {
      return new Promise(function (resolve, reject) {
        if (manifest.history === true) {
          history_manifest = JSON.parse(_fs2.default.readFileSync(directory + '/_set-history.json'));
          history_item_model = {
            timestamp: new Date(),
            manifest: manifest
          };
          history_manifest.history.push(history_item_model);
          _fs2.default.writeFileSync(directory + '/_set-history.json', JSON.stringify(history_manifest, null, '\t'));
          resolve(manifest);
        }
        if (manifest.history === false) {
          console.log('Looks like "history" is set to false in your manifest file. Change it to true to enable history functions');
          reject('The "history" attribute in your manifest file has been set to false');
        }
      });
    }
  }, {
    key: 'revertVersion',
    value: function revertVersion(directory, manifest) {
      return new Promise(function (resolve, reject) {
        if (manifest.history === true) {
          history_manifest = JSON.parse(_fs2.default.readFileSync(directory + '/_set-history.json'));
          manifest = history_manifest.history[history_manifest.history.length - 1].manifest;
          history_manifest.history.pop();
          _fs2.default.writeFileSync(directory + '/_set.json', JSON.stringify(manifest, null, '\t'));
          _fs2.default.writeFileSync(directory + '/_set-history.json', JSON.stringify(history_manifest, null, '\t'));
          wikisets.set.syncManifest(directory, manifest);
          resolve(manifest);
        }
        if (manifest.history === false) {
          console.log('Looks like the "history" is set to false in your manifest file. Change it to true to enable history functions');
          reject('The "history" attribute in your manifest file has been set to false');
        }
      });
    }
  }]);

  return Version;
}();

exports.default = Version;