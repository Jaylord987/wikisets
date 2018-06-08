class Parser {
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