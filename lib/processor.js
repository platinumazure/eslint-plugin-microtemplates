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

var createTemplate = require("lodash.template");

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
        var compiledSource = createTemplate(text).source;
        return [compiledSource];
    },

    /**
     * Post-processes the error messages from each file.
     * @param {Array<Array<ErrorMessage>>} messages A two-dimensional array of messages.
     * @returns {Array<ErrorMessage>} The messages to be reported by ESLint.
     */
    postprocess: function(messages) {
        return messages[0];
    }
};
