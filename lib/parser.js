/*
Custom tools for parsing various formats
*/

module.exports = function (wikisets) {
  wikisets.parser = {
    breakIntoLines: function (input) {
      var output = []
      var current_line = ""
      for (var i=0; i<input.length; i++) {
        if (input[i] === "\n") {
          output.push(current_line)
          current_line = ""
        }
        else {
          current_line = current_line + input[i]
        }
      }
      return output
    },
    mediawikiToMarkdown: function (input) {
      var list_of_lines = wikisets.parser.breakIntoLines(input)
      for (var i=0; i<list_of_lines.length; i++) {
        for (var q=2; q<7; q++) {
          var section_marker = "=".repeat(q)
          if (list_of_lines[i].startsWith(section_marker + " ")) {
            list_of_lines[i] = list_of_lines[i].replace(section_marker, "#".repeat(q))
            list_of_lines[i] = list_of_lines[i].replace(" " + section_marker, "")
          }
        }
      }
      /* This code isn't used yet, because I'm not sure how i want to go about this. Should I return an array of lines, or just one whole string?
      var output = ""
      for (var i=0; i<list_of_lines.length; i++) {
        output = output + list_of_lines[i] + "\n"
      }
      */
      return list_of_lines.join("\n")
    }
  }
}