/*
Keyword extraction tools
*/

var request = require("sync-request")
var jsdom = require("jsdom")
var { JSDOM } = jsdom
var keyword_extractor = require("keyword-extractor")

module.exports = function (wikisets) {
  wikisets.keywords = {
    scrapeURL: function(url) {
      var res = request("GET", url)
      var dom = new JSDOM(res.getBody())
      var meta_elements = dom.window.document.getElementsByTagName("META")
      for (var i=0; i<meta_elements.length; i++) {
        if (meta_elements[i].name === "description") {
          var description = meta_elements[i].content
        }
      }
      var title = dom.window.document.getElementsByTagName("TITLE")[0].text
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