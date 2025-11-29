#!/usr/bin/env node

/**
 * Wrapper script for EAS CLI that prevents update commands when DEV_MODE_HREF is truthy.
 * This script can be used as an alias or wrapper for the 'eas' command.
 * 
 * Usage:
 *   alias eas="node ./scripts/eas-wrapper.js"
 *   OR
 *   ./scripts/eas-wrapper.js update
 *   ./scripts/eas-wrapper.js update --platform=ios
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE_CONSTANTS_PATH = path.join(__dirname, "..", "src", "shared", "lib", "constants", "base.ts");

/**
 * Reads and parses the DEV_MODE_HREF constant from base.ts
 * @returns {string | null} The value of DEV_MODE_HREF or null if not found
 */
function getDevModeHref() {
  try {
    const fileContent = fs.readFileSync(BASE_CONSTANTS_PATH, "utf8");
    
    // Match DEV_MODE_HREF = "value" or DEV_MODE_HREF = 'value' or DEV_MODE_HREF = `value`
    const match = fileContent.match(/export\s+const\s+DEV_MODE_HREF\s*=\s*(["'`])(.*?)\1/);
    
    if (match && match[2]) {
      return match[2];
    }
    
    // Also check for template literals
    const templateMatch = fileContent.match(/export\s+const\s+DEV_MODE_HREF\s*=\s*`([^`]*)`/);
    if (templateMatch && templateMatch[1]) {
      return templateMatch[1];
    }
    
    return null;
  } catch (error) {
    // If we can't read the file, allow the command to proceed (fail open)
    return null;
  }
}

/**
 * Checks if the command is an update command that should be blocked
 * @param {string[]} args - Command line arguments
 * @returns {boolean} True if this is an update command
 */
function isUpdateCommand(args) {
  return args.length > 0 && args[0] === "update";
}

/**
 * Main function to check DEV_MODE_HREF and either abort or proceed with eas command
 */
function main() {
  const args = process.argv.slice(2);
  
  // Only check for update commands
  if (isUpdateCommand(args)) {
    const devModeHref = getDevModeHref();
    
    if (devModeHref && devModeHref.trim() !== "") {
      console.error("\n❌ ERROR: Cannot run EAS update command while DEV_MODE_HREF is set!");
      console.error(`\n   DEV_MODE_HREF is currently set to: "${devModeHref}"`);
      console.error("\n   Please set DEV_MODE_HREF to an empty string in:");
      console.error(`   ${BASE_CONSTANTS_PATH}`);
      console.error("\n   Example:");
      console.error('   export const DEV_MODE_HREF = "";');
      console.error("\n");
      process.exit(1);
    }
  }
  
  // If we get here, either it's not an update command or DEV_MODE_HREF is empty
  // Proceed with the actual eas command
  const easProcess = spawn("eas", args, {
    stdio: "inherit",
    shell: true,
  });
  
  easProcess.on("exit", (code) => {
    process.exit(code || 0);
  });
  
  easProcess.on("error", (error) => {
    console.error("Error running eas command:", error.message);
    process.exit(1);
  });
}

main();

