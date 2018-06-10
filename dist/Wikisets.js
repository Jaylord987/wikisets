'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSet = exports.Wikisets = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //modules


//subclasses


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _uniqueConcat = require('unique-concat');

var _uniqueConcat2 = _interopRequireDefault(_uniqueConcat);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _wikijs = require('wikijs');

var _wikijs2 = _interopRequireDefault(_wikijs);

var _Version = require('./Version.js');

var _Version2 = _interopRequireDefault(_Version);

var _Parser = require('./Parser.js');

var _Parser2 = _interopRequireDefault(_Parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Wikisets constructor
 * @class
 * @example
 * let wikiset = new Wikisets('./my_set_dir');
 * 
 * @param {string} directory - Set's directory path
 */
var Wikisets = function () {
  function Wikisets(directory) {
    _classCallCheck(this, Wikisets);

    this.directory = directory;
    this.manifest = JSON.parse(_fs2.default.readFileSync(this.directory + '/_set.json', 'utf8'));

    this.Version = new _Version2.default();
    this.Parser = new _Parser2.default();
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


  _createClass(Wikisets, [{
    key: 'syncManifest',
    value: function syncManifest() {
      var _this = this;

      var directory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.directory;
      var manifest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.manifest;

      return new Promise(function (resolve, reject) {
        (0, _glob2.default)(directory + '/*' + manifest.extension, function (err, files) {
          for (var i = 0; i < files.length; i++) {
            var article_name = files[i].replace(/^.*[\\\/]/, '');
            article_name = article_name.substring(0, article_name.length - 4);
            if (manifest.articles.indexOf(article_name) === -1) {
              _fs2.default.unlinkSync(files[i]);
            }
          }

          var _loop = function _loop(_i) {
            var exist_status = _fs2.default.existsSync(directory + '/' + manifest.articles[_i] + manifest.extension);
            if (exist_status === true) {}
            if (exist_status === false) {
              (0, _wikijs2.default)().page(manifest.articles[_i]).then(function (page) {
                return page.content();
              }).then(function (content) {
                _fs2.default.writeFileSync(directory + '/' + manifest.articles[_i] + manifest.extension, _this.Parser.mediawikiToMarkdown(content));
              });
            }
          };

          for (var _i = 0; _i < manifest.articles.length; _i++) {
            _loop(_i);
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

  }, {
    key: 'addArticle',
    value: function addArticle(title) {
      var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.directory;
      var manifest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.manifest;

      this.Version.bumpVersion(directory, manifest);
      return new Promise(function (resolve, reject) {
        (0, _wikijs2.default)().page(title).then(function (page) {
          return page.content();
        }).then(function (content) {
          if (manifest.articles.indexOf(title) === -1) {
            manifest.articles.push(title);
            _fs2.default.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
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

  }, {
    key: 'removeArticle',
    value: function removeArticle(title) {
      var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.directory;
      var manifest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.manifest;

      this.Version.bumpVersion(directory, manifest);
      return new Promise(function (resolve, reject) {
        try {
          _fs2.default.unlinkSync(directory + "/" + title + manifest.extension);
          manifest.articles.splice(manifest.articles.indexOf(title), 1);
          _fs2.default.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
          resolve(manifest);
        } catch (err) {
          reject('Article not found in manifest');
        }
      });
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

  }, {
    key: 'mergeManifests',
    value: function mergeManifests(secondaryManifest) {
      var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.directory;
      var primaryManifest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.manifest;

      return new Promise(function (resolve, reject) {
        primaryManifest.articles = (0, _uniqueConcat2.default)(primaryManifest.articles, secondaryManifest.articles);
        _fs2.default.writeFileSync(directory + '/' + '_set.json', JSON.stringify(primaryManifest, null, '\t'));
        resolve(manifest);
      });
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

  }, {
    key: 'updateArticles',
    value: function updateArticles() {
      var _this2 = this;

      var directory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.directory;
      var manifest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.manifest;

      return new Promise(function (resolve, reject) {
        for (var i = 0; i < manifest.articles.length; i++) {
          (0, _wikijs2.default)().page(title).then(function (page) {
            return page.content();
          }).then(function (content) {
            _fs2.default.writeFileSync(directory + '/' + manifest.articles[i] + manifest.extension, _this2.Parser.mediawikiToMarkdown(content));
            resolve(manifest);
          });
        }
      });
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

  }, {
    key: 'repairManifest',
    value: function repairManifest() {
      var directory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.directory;
      var manifest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.manifest;

      if (manifest.extension === undefined) {
        manifest.extension = '.txt';
      }
      if (manifest.articles === undefined) {
        manifest.articles = [];
      }
      _fs2.default.writeFileSync(directory + '/_set.json', JSON.stringify(manifest, null, '\t'));
    }
  }]);

  return Wikisets;
}();

/**
 * Create a new set
 * @function
 * @example
 * createSet('./set');
 * 
 * @param {string} directory - Directory path for set creation
 */


var createSet = function createSet(directory) {
  var model = {
    name: 'Insert this set\'s name',
    info: 'Insert some info about this set',
    history: true,
    extension: '.txt',
    articles: []
  };
  if (_fs2.default.existsSync(directory) === false) {
    _fs2.default.mkdirSync(directory);
  }
  _fs2.default.writeFileSync(directory + '/_set.json', JSON.stringify(model, null, '\t'));
  var version = new _Version2.default();
  version.createHistoryManifest(directory);
};

exports.Wikisets = Wikisets;
exports.createSet = createSet;