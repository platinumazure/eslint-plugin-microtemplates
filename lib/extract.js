/**
 * @fileoverview Utility for extracting executable code from microtemplates.
 * @author Kevin Partington
 * @copyright 2015 Kevin Partington. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var delimiters = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};

//------------------------------------------------------------------------------
// Public interface
//------------------------------------------------------------------------------

module.exports = function(text) {
    var matcher = RegExp([
        delimiters.escape.source,
        delimiters.interpolate.source,
        delimiters.evaluate.source
    ].join("|") + "|$", "g");

    var currentIndex = 0,
        currentLine = 1,
        escapeMatcher = /\\|\r|\n|\u2028|\u2029|'/g,
        newlineMatcher = /\r\n|\r|\n/g,
        lines = [{ code: "/*global print*/", line: 0 }],
        escapes = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        escapeChar = function(match) {
            return "\\" + escapes[match];
        };

    function processTextBeforeDelimiter(match, offset) {
        // Get text before the delimiter we just matched on and make it
        // suitable for string injection
        var textBeforeDelimiter = text.slice(currentIndex, offset),
            escapedTextBeforeDelimiter = textBeforeDelimiter.replace(escapeMatcher, escapeChar);
        
        // Add "print()" line for text up until now
        lines.push({
            code: "print('" + escapedTextBeforeDelimiter + "'); // eslint-disable-line",
            line: currentLine
        });

        // Update currentIndex
        currentIndex = offset + match.length;

        // Determine what line we are on now
        var newLines = textBeforeDelimiter.match(newlineMatcher) || [];
        currentLine += newLines.length;
    }

    text.replace(matcher, function(fullMatch, escape, interpolate, evaluate, offset) {
        var newLines;

        processTextBeforeDelimiter(fullMatch, offset);

        if (escape || interpolate) {
            // We don't actually care about escaping for linting purposes.
            // We can assume that the escape function used by the library is
            // lint-free, or at least that users don't want to see lint errors
            // due to the library.
            lines.push({
                code: "print(" + (escape || interpolate) + ");",
                line: currentLine
            });
        } else if (evaluate) {
            lines.push({
                code: evaluate,
                line: currentLine
            });
        }

        // Update currentLine from this match.
        newLines = fullMatch.match(newlineMatcher) || [];
        currentLine += newLines.length;

        // Return matched string to avoid exceptions from some user agents
        return fullMatch;
    });

    return lines;
};
