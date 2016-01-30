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
    simpleInterpolationMultiline: "tests/fixtures/simple-interpolation-multiline.html",
    oneInterpolationTwoLines: "tests/fixtures/one-interpolation-two-lines.html",
    simpleCodeExecution: "tests/fixtures/simple-code-execution.html",
    simpleCodeExecutionMultiline: "tests/fixtures/simple-code-execution-multiline.html"
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

            assert.strictEqual(result[0].code, "/*global print*/\n");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");
            assert.notProperty(result[0], "range");

            assert.strictEqual(result[1].code, "print('Hello, '); // eslint-disable-line\n");
            assert.strictEqual(result[1].line, 1);
            assert.notProperty(result[1], "originalLine");
            assert.notProperty(result[1], "originalColumn");
            assert.notProperty(result[1], "range");

            assert.strictEqual(result[2].code, "print( \"world!\" ); // eslint-disable-line semi\n");
            assert.strictEqual(result[2].line, 2);
            assert.strictEqual(result[2].originalLine, 1);
            assert.strictEqual(result[2].originalColumn, 11);
            assert.strictEqual(result[2].range, 0);

            assert.strictEqual(result[3].code, "print('\\r\\n'); // eslint-disable-line\n");
            assert.strictEqual(result[3].line, 3);
            assert.notProperty(result[3], "originalLine");
            assert.notProperty(result[3], "originalColumn");
            assert.notProperty(result[3], "range");
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

            assert.strictEqual(result[0].code, "/*global print*/\n");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");
            assert.notProperty(result[0], "range");

            assert.strictEqual(result[1].code, "print( \"Hello,\" ); // eslint-disable-line semi\n");
            assert.strictEqual(result[1].line, 1);
            assert.strictEqual(result[1].originalLine, 1);
            assert.strictEqual(result[1].originalColumn, 4);
            assert.strictEqual(result[1].range, 0);

            assert.strictEqual(result[2].code, "print(' '); // eslint-disable-line\n");
            assert.strictEqual(result[2].line, 2);
            assert.notProperty(result[2], "originalLine");
            assert.notProperty(result[2], "originalColumn");
            assert.notProperty(result[2], "range");

            assert.strictEqual(result[3].code, "print( \"world!\" ); // eslint-disable-line semi\n");
            assert.strictEqual(result[3].line, 3);
            assert.strictEqual(result[3].originalLine, 1);
            assert.strictEqual(result[3].originalColumn, 20);
            assert.strictEqual(result[3].range, 47);
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

            assert.strictEqual(result[0].code, "/*global print*/\n");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");
            assert.notProperty(result[0], "range");

            assert.strictEqual(result[1].code, "print('Hello, '); // eslint-disable-line\n");
            assert.strictEqual(result[1].line, 1);
            assert.notProperty(result[1], "originalLine");
            assert.notProperty(result[1], "originalColumn");
            assert.notProperty(result[1], "range");

            assert.strictEqual(result[2].code, "print( \"world!\" ); // eslint-disable-line semi\n");
            assert.strictEqual(result[2].line, 2);
            assert.strictEqual(result[2].originalLine, 1);
            assert.strictEqual(result[2].originalColumn, 11);
            assert.strictEqual(result[2].range, 0);

            assert.strictEqual(result[3].code, "print('\\r\\nHow are you '); // eslint-disable-line\n");
            assert.strictEqual(result[3].line, 3);
            assert.notProperty(result[3], "originalLine");
            assert.notProperty(result[3], "originalColumn");
            assert.notProperty(result[3], "range");

            assert.strictEqual(result[4].code, "print( \"today\" ); // eslint-disable-line semi\n");
            assert.strictEqual(result[4].line, 4);
            assert.strictEqual(result[4].originalLine, 2);
            assert.strictEqual(result[4].originalColumn, 16);
            assert.strictEqual(result[4].range, 47);

            assert.strictEqual(result[5].code, "print('?\\r\\n'); // eslint-disable-line\n");
            assert.strictEqual(result[5].line, 5);
            assert.notProperty(result[5], "originalLine");
            assert.notProperty(result[5], "originalColumn");
            assert.notProperty(result[5], "range");
        });
    });

    describe("One interpolation on two lines", function() {
        var fileContents;

        beforeEach(function(done) {
            fs.readFile(fixtures.oneInterpolationTwoLines, "utf-8", function(err, contents) {
                if (err) throw err;
                fileContents = contents;
                done();
            });
        });

        it("should extract 4 code snippets", function() {
            var result = extract(fileContents);

            assert.strictEqual(result.length, 4);

            assert.strictEqual(result[0].code, "/*global print*/\n");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");
            assert.notProperty(result[0], "range");

            assert.strictEqual(result[1].code, "print('Hello, '); // eslint-disable-line\n");
            assert.strictEqual(result[1].line, 1);
            assert.notProperty(result[1], "originalLine");
            assert.notProperty(result[1], "originalColumn");
            assert.notProperty(result[1], "range");

            assert.strictEqual(result[2].code, "print( \"world\" +\n\"!\" ); // eslint-disable-line semi\n");
            assert.strictEqual(result[2].line, 2);
            assert.strictEqual(result[2].originalLine, 1);
            assert.strictEqual(result[2].originalColumn, 11);
            assert.strictEqual(result[2].range, 0);

            assert.strictEqual(result[3].code, "print('\\n'); // eslint-disable-line\n");
            assert.strictEqual(result[3].line, 4);
            assert.notProperty(result[3], "originalLine");
            assert.notProperty(result[3], "originalColumn");
            assert.notProperty(result[3], "range");
        });
    });

    describe("Simple code execution", function () {
        var fileContents;

        beforeEach(function(done) {
            fs.readFile(fixtures.simpleCodeExecution, "utf-8", function(err, contents) {
                if (err) throw err;
                fileContents = contents;
                done();
            });
        });

        it("should extract 5 code snippets", function() {
            var result = extract(fileContents);

            assert.strictEqual(result.length, 5);

            assert.strictEqual(result[0].code, "/*global print*/\n");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");
            assert.notProperty(result[0], "range");

            assert.strictEqual(result[1].code, " for (var i = 0; i < 5; ++i) { \n");
            assert.strictEqual(result[1].line, 1);
            assert.strictEqual(result[1].originalLine, 1);
            assert.strictEqual(result[1].originalColumn, 3);
            assert.strictEqual(result[1].range, 0);

            assert.strictEqual(result[2].code, "print('\\r\\nHello!\\r\\n'); // eslint-disable-line\n");
            assert.strictEqual(result[2].line, 2);
            assert.notProperty(result[2], "originalLine");
            assert.notProperty(result[2], "originalColumn");
            assert.notProperty(result[2], "range");

            assert.strictEqual(result[3].code, " } \n");
            assert.strictEqual(result[3].line, 3);
            assert.strictEqual(result[3].originalLine, 3);
            assert.strictEqual(result[3].originalColumn, 3);
            assert.strictEqual(result[3].range, 32);

            assert.strictEqual(result[4].code, "print('\\r\\n'); // eslint-disable-line\n");
            assert.strictEqual(result[4].line, 4);
            assert.notProperty(result[4], "originalLine");
            assert.notProperty(result[4], "originalColumn");
            assert.notProperty(result[4], "range");
        });
    });

    describe("Simple code execution (multiple lines)", function () {
        var fileContents;

        beforeEach(function(done) {
            fs.readFile(fixtures.simpleCodeExecutionMultiline, "utf-8", function(err, contents) {
                if (err) throw err;
                fileContents = contents;
                done();
            });
        });

        it("should extract 3 code snippets", function () {
            var result = extract(fileContents);

            assert.strictEqual(result.length, 3);

            assert.strictEqual(result[0].code, "/*global print*/\n");
            assert.notProperty(result[0], "line");
            assert.notProperty(result[0], "originalLine");
            assert.notProperty(result[0], "originalColumn");
            assert.notProperty(result[0], "range");

            assert.strictEqual(result[1].code, " for (var i = 0; i < 5; ++i) {\r\n    print(\"Hello!\\n\");\r\n} \n");
            assert.strictEqual(result[1].line, 1);
            assert.strictEqual(result[1].originalLine, 1);
            assert.strictEqual(result[1].originalColumn, 3);
            assert.strictEqual(result[1].range, 0);

            assert.strictEqual(result[2].code, "print('\\r\\n'); // eslint-disable-line\n");
            assert.strictEqual(result[2].line, 4);
            assert.notProperty(result[2], "originalLine");
            assert.notProperty(result[2], "originalColumn");
            assert.notProperty(result[2], "range");
        });
    });
});
