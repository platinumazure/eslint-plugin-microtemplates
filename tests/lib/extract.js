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

describe("extract", function () {
    describe("simple interpolation", function() {
        var fileContents;

        beforeEach(function(done) {
            fs.readFile(fixtures.simpleInterpolation, "utf-8", function(err, contents) {
                if (err) throw err;
                fileContents = contents;
                done();
            });
        });

        it("should extract 4 code snippets", function() {
            var result = extract(fileContents);

            assert.strictEqual(result.length, 4);

            assert.strictEqual(result[0].code, "/*global print*/");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "column");

            assert.strictEqual(result[1].code, "print('Hello, '); // eslint-disable-line");
            assert.notProperty(result[1], "line");
            assert.notProperty(result[1], "column");

            assert.strictEqual(result[2].code, "print( \"world!\" ); // eslint-disable-line semi");
            assert.strictEqual(result[2].line, 1);
            assert.strictEqual(result[2].column, 8);

            assert.strictEqual(result[3].code, "print('\\r\\n'); // eslint-disable-line");
            assert.notProperty(result[3], "line");
            assert.notProperty(result[3], "column");
        });
    });
});
