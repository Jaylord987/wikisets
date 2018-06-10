'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Parser subclass constructor
 * @class
 * @example
 * wikiset.Parser.insertMethodHere();
 * //or
 * let parser = new Parser();
 */
var Parser = function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, [{
        key: 'breakIntoLines',

        /**
         * Break a string into lines
         * @method
         * 
         * @param {string} input - String to break into lines
         * @returns {list} List of all the individual strings
         */
        value: function breakIntoLines(input) {
            var output = [];
            var current_line = '';
            for (var i = 0; i < input.length; i++) {
                if (input[i] === '\n') {
                    output.push(current_line);
                    current_line = '';
                } else {
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

    }, {
        key: 'mediawikiToMarkdown',
        value: function mediawikiToMarkdown(input) {
            var list_of_lines = this.breakIntoLines(input);
            for (var i = 0; i < list_of_lines.length; i++) {
                for (var q = 2; q < 7; q++) {
                    var section_marker = '='.repeat(q);
                    if (list_of_lines[i].startsWith(section_marker + ' ')) {
                        list_of_lines[i] = list_of_lines[i].replace(section_marker, '#'.repeat(q));
                        list_of_lines[i] = list_of_lines[i].replace(' ' + section_marker, '');
                    }
                }
            }
            return list_of_lines.join('\n');
        }
    }]);

    return Parser;
}();

exports.default = Parser;