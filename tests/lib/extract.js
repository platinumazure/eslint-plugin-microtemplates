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
    simpleInterpolation: "tests/fixtures/simple-interpolation.html",
    twoInterpolationsOneLine: "tests/fixtures/two-interpolations-one-line.html",
    simpleInterpolationMultiline: "tests/fixtures/simple-interpolation-multiline.html"
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
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");

            assert.strictEqual(result[1].code, "print('Hello, '); // eslint-disable-line");
            assert.notProperty(result[1], "originalLine");
            assert.notProperty(result[1], "originalColumn");

            assert.strictEqual(result[2].code, "print( \"world!\" ); // eslint-disable-line semi");
            assert.strictEqual(result[2].originalLine, 1);
            assert.strictEqual(result[2].originalColumn, 11);

            assert.strictEqual(result[3].code, "print('\\r\\n'); // eslint-disable-line");
            assert.notProperty(result[3], "originalLine");
            assert.notProperty(result[3], "originalColumn");
        });
    });

    describe("two interpolations on one line", function() {
        var fileContents;

        beforeEach(function(done) {
            fs.readFile(fixtures.twoInterpolationsOneLine, "utf-8", function(err, contents) {
                if (err) throw err;
                fileContents = contents;
                done();
            });
        });

        it("should extract 5 code snippets", function() {
            var result = extract(fileContents);

            assert.strictEqual(result.length, 5);

            assert.strictEqual(result[0].code, "/*global print*/");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");

            assert.strictEqual(result[1].code, "print( \"Hello,\" ); // eslint-disable-line semi");
            assert.strictEqual(result[1].originalLine, 1);
            assert.strictEqual(result[1].originalColumn, 4);

            assert.strictEqual(result[2].code, "print(' '); // eslint-disable-line");
            assert.notProperty(result[2], "originalLine");
            assert.notProperty(result[2], "originalColumn");

            assert.strictEqual(result[3].code, "print( \"world!\" ); // eslint-disable-line semi");
            assert.strictEqual(result[3].originalLine, 1);
            assert.strictEqual(result[3].originalColumn, 20);
        });
    });

    describe("simple interpolation (multiple lines of text)", function() {
        var fileContents;

        beforeEach(function(done) {
            fs.readFile(fixtures.simpleInterpolationMultiline, "utf-8", function(err, contents) {
                if (err) throw err;
                fileContents = contents;
                done();
            });
        });

        it("should extract 6 code snippets", function() {
            var result = extract(fileContents);

            assert.strictEqual(result.length, 6);

            assert.strictEqual(result[0].code, "/*global print*/");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");

            assert.strictEqual(result[1].code, "print('Hello, '); // eslint-disable-line");
            assert.notProperty(result[1], "originalLine");
            assert.notProperty(result[1], "originalColumn");

            assert.strictEqual(result[2].code, "print( \"world!\" ); // eslint-disable-line semi");
            assert.strictEqual(result[2].originalLine, 1);
            assert.strictEqual(result[2].originalColumn, 11);

            assert.strictEqual(result[3].code, "print('\\r\\nHow are you '); // eslint-disable-line");
            assert.notProperty(result[3], "originalLine");
            assert.notProperty(result[3], "originalColumn");

            assert.strictEqual(result[4].code, "print( \"today\" ); // eslint-disable-line semi");
            assert.strictEqual(result[4].originalLine, 2);
            assert.strictEqual(result[4].originalColumn, 16);

            assert.strictEqual(result[5].code, "print('?\\r\\n'); // eslint-disable-line");
            assert.notProperty(result[5], "originalLine");
            assert.notProperty(result[5], "originalColumn");
        });
    });
});
