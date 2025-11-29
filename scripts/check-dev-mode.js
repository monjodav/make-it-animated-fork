#!/usr/bin/env node

/**
 * Safeguard script to prevent EAS update commands when DEV_MODE_HREF is truthy.
 * This script checks the DEV_MODE_HREF constant and aborts if it's set.
 */

const fs = require("fs");
const path = require("path");

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
    console.error("Error reading base.ts:", error.message);
    process.exit(1);
  }
}

/**
 * Main function to check DEV_MODE_HREF and abort if truthy
 */
function checkDevMode() {
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
  
  // If we get here, DEV_MODE_HREF is empty/falsy, so we can proceed
  process.exit(0);
}

checkDevMode();

