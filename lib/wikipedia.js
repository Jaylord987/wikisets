/*
Wikipedia Interfacing Functions
*/

var wiki = require("wikijs").default

module.exports = function (wikisets) {
  wikisets.wikipedia = {
    search: function (query, callback) {
      wiki()
        .search(query)
        .then(function(result) {
          callback(result)
        })
    },
    getArticleData: function (query, callback) {
      wiki()
        .page(query)
        .then(function(page) {
          callback(page)
        })
    }
  }
}