/**
 * @fileoverview Extractor tests for eslint-plugin-microtemplates.
 * @author Kevin Partington
 * @copyright 2015 Kevin Partington. All rights reserved.
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var assert = require("chai").assert,
    extract = require("../../lib/extract"),
    fs = require("fs");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

var fixtures = {
    simpleInterpolation: "tests/fixtures/simple-interpolation.html"
};

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("simple interpolation", function() {
    var fileContents;

    beforeEach(function(done) {
        fs.readFile(fixtures.simpleInterpolation, "utf-8", function(err, contents) {
            if (err) throw err;
            fileContents = contents;
            done();
        });
    });

    it("sanity test", function() {
        assert.ok(fileContents);
        assert.ok(extract(fileContents));
    });
});
