/**
 * Parser subclass constructor
 * @class
 * @example
 * wikiset.Parser.insertMethodHere();
 * //or
 * let parser = new Parser();
 */
class Parser {
    /**
     * Break a string into lines
     * @method
     * 
     * @param {string} input - String to break into lines
     * @returns {list} List of all the individual strings
     */
    breakIntoLines(input) {
        let output = [];
        let current_line = '';
        for (let i=0; i<input.length; i++) {
            if (input[i] === '\n') {
                output.push(current_line);
                current_line = '';
            }
            else {
                current_line = current_line + input[i];
            }
        }
        return output;
    }
    /**
     * Turn a string formatted with mediawiki to one formatted with markdown
     * @method
     * 
     * @param {string} input - String to convert
     * @returns {string} Outputted, formatted markdown string
     */
    mediawikiToMarkdown(input) {
        let list_of_lines = this.breakIntoLines(input);
        for (let i=0; i<list_of_lines.length; i++) {
            for (let q=2; q<7; q++) {
                let section_marker = '='.repeat(q);
                if (list_of_lines[i].startsWith(section_marker + ' ')) {
                    list_of_lines[i] = list_of_lines[i].replace(section_marker, '#'.repeat(q));
                    list_of_lines[i] = list_of_lines[i].replace(' ' + section_marker, '');
                }
            }
        }
        return list_of_lines.join('\n');
    }
}

export default Parser;