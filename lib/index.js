var wikisets = {
  
}

require("./wikipedia")(wikisets)
require("./set")(wikisets)
require("./keywords")(wikisets)
require("./version")(wikisets)

module.exports = wikisets