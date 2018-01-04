/*
Wikipedia Interfacing Functions
*/

var wiki = require("wikijs").default

module.exports = function (wikisets) {
  wikisets.wikipedia = {
    search: function (query, callback) {
      console.log("Making search request to Wikipedia")
      wiki()
        .search(query)
        .then(function(result) {
          callback(result)
        })
    },
    getArticleData: function (query, callback) {
      console.log("Making page data request to Wikipedia")
      wiki()
        .page(query)
        .then(function(page) {
          callback(page)
        })
    }
  }
}