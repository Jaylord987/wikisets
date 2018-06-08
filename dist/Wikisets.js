'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSet = exports.Wikisets = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //modules


//subclasses


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

var Wikisets = function () {
  function Wikisets(directory) {
    _classCallCheck(this, Wikisets);

    this.directory = directory;
    this.manifest = JSON.parse(_fs2.default.readFileSync(this.directory + '/_set.json', 'utf8'));

    this.Version = new _Version2.default();
    this.Parser = new _Parser2.default();
  }

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
              console.log('"' + article_name + '" is downloaded but isn\'t in your manifest. Deleting right now');
              _fs2.default.unlinkSync(files[i]);
            }
          }

          var _loop = function _loop(_i) {
            var exist_status = _fs2.default.existsSync(directory + '/' + manifest.articles[_i] + manifest.extension);
            if (exist_status === true) {
              console.log('"' + manifest.articles[_i] + '" exists');
            }
            if (exist_status === false) {
              console.log('"' + manifest.articles[_i] + '" doesn\'t exist. Downloading it right now');
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
  }, {
    key: 'addArticle',
    value: function addArticle(title) {
      var _this2 = this;

      var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.directory;
      var manifest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.manifest;

      this.Version.bumpVersion(directory, manifest);
      return new Promise(function (resolve, reject) {
        (0, _wikijs2.default)().page(title).then(function (page) {
          return page.content();
        }).then(function (content) {
          _fs2.default.writeFileSync(directory + '/' + title + manifest.extension, _this2.Parser.mediawikiToMarkdown(content));
          console.log(manifest);
          if (manifest.articles.indexOf(title) === -1) {
            console.log('Updating manifest');
            manifest.articles.push(title);
            _fs2.default.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
          }
        });
      });
    }
  }, {
    key: 'removeArticle',
    value: function removeArticle(title) {
      var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.directory;
      var manifest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.manifest;

      this.Version.bumpVersion(directory, manifest);
      return new Promise(function (resolve, reject) {
        try {
          console.log('Removing "' + title + '"');
          _fs2.default.unlinkSync(directory + "/" + title + manifest.extension);
          manifest.articles.splice(manifest.articles.indexOf(title), 1);
          _fs2.default.writeFileSync(directory + '/' + '_set.json', JSON.stringify(manifest, null, '\t'));
          resolve(manifest);
        } catch (err) {
          console.log('"' + title + '" wasn\'t found');
          reject('Article not found in manifest');
        }
      });
    }
  }, {
    key: 'mergeManifest',
    value: function mergeManifest(secondaryManifest) {
      var directory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.directory;
      var primaryManifest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.manifest;

      return new Promise(function (resolve, reject) {
        console.log('Combining and saving manifest');
        primaryManifest.articles = (0, _uniqueConcat2.default)(primaryManifest.articles, secondaryManifest.articles);
        _fs2.default.writeFileSync(directory + '/' + '_set.json', JSON.stringify(primaryManifest, null, '\t'));
        resolve(manifest);
      });
    }
  }, {
    key: 'updateArticles',
    value: function updateArticles() {
      var _this3 = this;

      var directory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.directory;
      var manifest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.manifest;

      return new Promise(function (resolve, reject) {
        for (var i = 0; i < manifest.articles.length; i++) {
          (0, _wikijs2.default)().page(title).then(function (page) {
            return page.content();
          }).then(function (content) {
            console.log('Updating "' + manifest.articles[i] + '"');
            _fs2.default.writeFileSync(directory + '/' + manifest.articles[i] + manifest.extension, _this3.Parser.mediawikiToMarkdown(content));
            resolve(manifest);
          });
        }
      });
    }
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

var createSet = function createSet(directory) {
  var model = {
    name: 'Insert this set\'s name',
    info: 'Insert some info about this set',
    history: true,
    extension: '.txt',
    articles: []
  };
  console.log('Creating new set at ' + directory);
  if (_fs2.default.existsSync(directory) === false) {
    _fs2.default.mkdirSync(directory);
  }
  _fs2.default.writeFileSync(directory + '/_set.json', JSON.stringify(model, null, '\t'));
  var version = new _Version2.default();
  version.createHistoryManifest(directory);
};

exports.Wikisets = Wikisets;
exports.createSet = createSet;