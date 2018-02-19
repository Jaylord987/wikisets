/*
Keyword extraction tools
*/

var request = require("sync-request")
var cheerio = require("cheerio")
var keyword_extractor = require("keyword-extractor")

module.exports = function (wikisets) {
  wikisets.keywords = {
    scrapeURL: function(url) {
      var res = request("GET", url)
      var $ = cheerio.load(res.getBody())
      var description = $("meta[name=description]").attr("content")
      var title = $("title").text()
      var keywords = keyword_extractor.extract(description, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        return_chained_words: true,
        remove_duplicates: true
      })
      keywords = keywords.concat(keyword_extractor.extract(description, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        return_chained_words: false,
        remove_duplicates: true
      }))
      keywords = keywords.concat(keyword_extractor.extract(title, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        return_chained_words: true,
        remove_duplicates: true
      }))
      keywords = keywords.concat(keyword_extractor.extract(title, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        return_chained_words: false,
        remove_duplicates: true
      }))
      for (var i=0; i<keywords.length; i++) {
        if (typeof keywords[i] !== "string") {
          delete keywords[i]
        }
      }
      return keywords
    }
  }
}