/**
 * @fileoverview Integration tests for eslint-plugin-microtemplates.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var assert = require("chai").assert,
    CLIEngine = require("eslint").CLIEngine,
    pluginIndex = require("../lib/index");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("Integration tests", function () {

    describe("Code execution", function () {
        var cliEngine;

        beforeEach(function () {
            cliEngine = new CLIEngine({
                extensions: [".html"],
                baseConfig: false,
                rules: {
                    "semi": [2, "always"]
                },
                plugins: ["microtemplates"],
                useEslintrc: false
            });

            cliEngine.addPlugin("eslint-plugin-microtemplates", pluginIndex);
        });

        describe("Error on first line", function () {
            var report;

            beforeEach(function () {
                report = cliEngine.executeOnFiles(["tests/fixtures/integration/known-eslint-error.html"]);
            });

            it("should contain results with one message", function () {
                assert.ok(report);
                assert.ok(report.results);
                assert.strictEqual(report.results.length, 1);
                assert.ok(report.results[0]);
                assert.ok(report.results[0].messages);
                assert.strictEqual(report.results[0].messages.length, 1);
            });

            it("should contain correct message", function () {
                var message = report.results[0].messages[0];

                assert.ok(message);
                assert.notOk(message.fatal);
                assert.strictEqual(message.severity, 2);
                assert.strictEqual(message.ruleId, "semi");
                assert.strictEqual(message.line, 1);
                assert.strictEqual(message.column, 10);
            });
        });

        describe("Error on second line", function () {
            var report;

            beforeEach(function () {
                report = cliEngine.executeOnFiles(["tests/fixtures/integration/error-multiline.html"]);
            });

            it("should contain results with one message", function () {
                assert.ok(report);
                assert.ok(report.results);
                assert.strictEqual(report.results.length, 1);
                assert.ok(report.results[0]);
                assert.ok(report.results[0].messages);
                assert.strictEqual(report.results[0].messages.length, 1);
            });

            it("should contain correct message", function () {
                var message = report.results[0].messages[0];

                assert.ok(message);
                assert.notOk(message.fatal);
                assert.strictEqual(message.severity, 2);
                assert.strictEqual(message.ruleId, "semi");
                assert.strictEqual(message.line, 2);
                assert.strictEqual(message.column, 10);
            });
        });
    });

    describe("Expression interpolation", function () {
        var cliEngine;

        beforeEach(function () {
            cliEngine = new CLIEngine({
                extensions: [".html"],
                baseConfig: false,
                rules: {
                    "no-extra-parens": 2
                },
                plugins: ["microtemplates"],
                useEslintrc: false
            });

            cliEngine.addPlugin("eslint-plugin-microtemplates", pluginIndex);
        });

        describe("Error on first line", function () {
            var report;

            beforeEach(function () {
                report = cliEngine.executeOnFiles(["tests/fixtures/integration/expression-error.html"]);
            });

            it("should contain results with one message", function () {
                assert.ok(report);
                assert.ok(report.results);
                assert.strictEqual(report.results.length, 1);
                assert.ok(report.results[0]);
                assert.ok(report.results[0].messages);
                assert.strictEqual(report.results[0].messages.length, 1);
            });

            it("should contain correct message", function () {
                var message = report.results[0].messages[0];

                assert.ok(message);
                assert.notOk(message.fatal);
                assert.strictEqual(message.severity, 2);
                assert.strictEqual(message.ruleId, "no-extra-parens");
                assert.strictEqual(message.line, 1);
                assert.strictEqual(message.column, 5);
            });
        });
    });
});
