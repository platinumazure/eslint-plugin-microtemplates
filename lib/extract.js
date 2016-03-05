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

module.exports = function (text) {
    var matcher = RegExp([
        delimiters.escape.source,
        delimiters.interpolate.source,
        delimiters.evaluate.source,
        "$"
    ].join("|"), "g");

    var currentRawIndex = 0,
        currentOutputIndex = 0,
        currentOutputLine = 1,
        currentRawLine = 1,
        currentRawColumn = 1,
        escapeMatcher = /\\|\r|\n|\u2028|\u2029|'/g,
        newlineMatcher = /\r\n|\r|\n|\u2028|\u2029/g,
        lines = [{ code: "/*global print*/\n" }],
        escapes = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        };

    function escapeChar(match) {
        return "\\" + escapes[match];
    }

    function processTextBeforeDelimiter(match, offset) {
        // Get text before the delimiter we just matched on and make it
        // suitable for string injection
        var textBeforeDelimiter,
            escapedTextBeforeDelimiter,
            newlines,
            lastNewline,
            startOfLineIndex;

        // Most of our operations only need to occur if there was actual
        // text before the delimiter.
        if (offset > 0) {
            textBeforeDelimiter = text.slice(currentRawIndex, offset);
            escapedTextBeforeDelimiter = textBeforeDelimiter.replace(escapeMatcher, escapeChar);

            // 1. Add "print()" line for text up until now.
            // Since this is plain text, not code, we want to avoid ESLint errors.
            lines.push({
                code: "print('" + escapedTextBeforeDelimiter + "'); // eslint-disable-line\n",
                line: currentOutputLine
            });

            // 2. Determine what line we are on now
            newlines = textBeforeDelimiter.match(newlineMatcher) || [];
            currentRawLine += newlines.length;

            // 3. Increment output line (note: text has been escaped so all on one line!)
            currentOutputLine += 1;

            // 4. Determine column offset for match
            if (newlines.length) {
                lastNewline = newlines[newlines.length - 1];
                startOfLineIndex = textBeforeDelimiter.lastIndexOf(lastNewline) + lastNewline.length;

                currentRawColumn = textBeforeDelimiter.length - startOfLineIndex + 1;
            } else {
                currentRawColumn += textBeforeDelimiter.length;
            }
        }

        // Finally, update currentRawIndex to include offset and match length
        currentRawIndex = offset + match.length;
    }

    text.replace(matcher, function (fullMatch, escape, interpolate, evaluate, offset) {
        var newLines,
            matchedCode = escape || interpolate || evaluate,
            trimmedCode = matchedCode && matchedCode.trim(),
            trimOffset = matchedCode && matchedCode.indexOf(trimmedCode);

        processTextBeforeDelimiter(fullMatch, offset);

        if (escape || interpolate) {
            // We don't actually care about escaping for linting purposes.
            // We can assume that the escape function used by the library is
            // lint-free, or at least that users don't want to see lint errors
            // due to the library.
            // Also, we want to add eslint-disable-line semi to avoid errors in
            // that rule, since only expressions should be valid here anyway.
            lines.push({
                code: "print(" + trimmedCode + "); // eslint-disable-line semi\n",
                originalLine: currentRawLine,
                originalColumn: currentRawColumn + fullMatch.indexOf(matchedCode),
                cookedOffset: 6,        // length of "print("
                trimOffset: trimOffset,
                line: currentOutputLine,
                range: currentOutputIndex
            });
        } else if (evaluate) {
            lines.push({
                code: trimmedCode + "\n",
                originalLine: currentRawLine,
                originalColumn: currentRawColumn + fullMatch.indexOf(matchedCode),
                cookedOffset: 0,
                trimOffset: trimOffset,
                line: currentOutputLine,
                range: currentOutputIndex
            });
        }

        // Detect newlines within matched text.
        newLines = fullMatch.match(newlineMatcher) || [];

        // Update current output index
        currentOutputIndex += lines[lines.length - 1].code.length;

        // Update current output line
        currentOutputLine += newLines.length + 1;

        // Update currentRawLine from this match.
        currentRawLine += newLines.length;

        // Update currentRawColumn from this match.
        if (newLines.length) {
            currentRawColumn = fullMatch.length - newlineMatcher.lastIndex;
        } else {
            currentRawColumn += fullMatch.length;
        }

        // Return matched string to avoid exceptions from some user agents
        return fullMatch;
    });

    return lines;
};
