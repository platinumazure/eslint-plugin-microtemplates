/**
 * @fileoverview Processor tests for eslint-plugin-microtemplates.
 * @author Kevin Partington
 * @copyright 2015 Kevin Partington. All rights reserved.
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var assert = require("chai").assert,
    processor = require("../../lib/processor");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("processor", function () {
    describe("preprocess", function() {
        it("should handle empty files", function() {
            var result = processor.preprocess("");
            assert.ok(result);
        });
    });

    describe("postprocess", function() {
        it("should unwrap empty message array", function() {
            var messages = [[]];
            var result = processor.postprocess(messages);
            assert.strictEqual(result, messages[0]);
        });
    });
});
