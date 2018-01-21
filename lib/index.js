var wikisets = {

}

require("./wikipedia")(wikisets)
require("./set")(wikisets)
require("./keywords")(wikisets)
require("./version")(wikisets)
require("./parser")(wikisets)

module.exports = wikisets