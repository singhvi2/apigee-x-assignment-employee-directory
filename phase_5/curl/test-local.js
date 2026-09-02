const fs = require("fs");
const path = require("path");

// This forces Node to look in the exact same folder as test-local.js
var sampleData = fs.readFileSync(
  path.join(__dirname, "sample-response.json"),
  "utf8",
);

var mockVariables = {
  "response.content": sampleData,
};

global.context = {
  getVariable: function (name) {
    return mockVariables[name];
  },
  setVariable: function (name, value) {
    mockVariables[name] = value;
  },
};

try {
  // Make sure your JS file path matches where it is located relative to test-local.js
  // For example, if TransformEmployeeResponse.js is in phase_4/javascript/:
  require("../apiproxy/resources/jsc/TransformEmployeeResponse.js");

  console.log("\n--- Test Results ---");
  console.log(
    "Transformed Content Output:\n",
    mockVariables["response.content"],
  );
  console.log(
    "Content-Type Header:",
    mockVariables["response.header.Content-Type"],
  );
} catch (error) {
  console.error("Error executing script:", error);
}
