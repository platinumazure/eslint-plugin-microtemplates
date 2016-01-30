/**
 * @fileoverview Processor for eslint-plugin-microtemplates.
 * @author Kevin Partington
 * @copyright 2015 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var assert = require("assert"),
    findLast = require("lodash.findlast"),
    extract = require("./extract");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

var currentFileLines;

//-----------------------------------------------------------------------------
// Public Interface
//-----------------------------------------------------------------------------

module.exports = {
    /**
     * Pre-processes each file by compiling it as a template.
     * @param {string} text The text of the file being processed.
     * @returns {Array<string>} The JavaScript blocks to be processed.
     */
    preprocess: function(text) {
        currentFileLines = extract(text);

        var code = currentFileLines.map(function (line) {
            return line.code;
        }).join("");

        return [code];
    },

    /**
     * Post-processes the error messages from each file.
     * @param {Array<Array<ErrorMessage>>} messages A two-dimensional array of messages.
     * @returns {Array<ErrorMessage>} The messages to be reported by ESLint.
     */
    postprocess: function(messages) {
        assert.strictEqual(messages.length, 1);
        assert(Array.isArray(messages[0]));

        messages[0].forEach(function (message) {
            var matchingLineInfo,
                lineOffset;

            // Subtract 1 line (to account for /*global print*/)
            --message.line;

            matchingLineInfo = findLast(currentFileLines, function (lineInfo) {
                return lineInfo.line <= message.line;
            });

            if (matchingLineInfo) {
                // Adjust message line to be offset from original line
                lineOffset = message.line - matchingLineInfo.line;
                message.line = matchingLineInfo.originalLine + lineOffset;

                // If on the first line of the original "line", apply column offset
                if (!lineOffset) {
                    message.column += matchingLineInfo.originalColumn - 1;
                    message.column -= matchingLineInfo.cookedOffset;
                }
            }
        });

        return messages[0];
    }
};
