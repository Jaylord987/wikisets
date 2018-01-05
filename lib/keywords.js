/*
Keyword extraction tools
*/

var request = require("sync-request")
var unfluff = require("unfluff")
var keyword_extractor = require("keyword-extractor")

module.exports = function (wikisets) {
  wikisets.keywords = {
    scrapeURL: function(url) {
      var res = request("GET", url)
      var data = unfluff(res.getBody())
      var keywords = keyword_extractor.extract(data.description, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        return_chained_words: true,
        remove_duplicates: true
      })
      return keywords
    }
  }
}