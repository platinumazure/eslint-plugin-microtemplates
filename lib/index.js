/**
 * @fileoverview ESLint plugin for linting Resig-style microtemplate strings.
 * @author Kevin Partington
 * @copyright 2015 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var processor = require("./processor");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
    processors: {
        ".htm": processor,
        ".html": processor
    }
};
