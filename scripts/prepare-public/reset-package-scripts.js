#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script resets package.json scripts section to a clean state for public branch.
 * Replaces complex scripts with simple dev, ios, and android scripts.
 * Can be run independently or as part of prepare-public.js
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const simpleScripts = {
  "dev": "expo start -c",
  "ios": "expo run:ios --device",
  "android": "expo run:android --device"
};

const resetPackageScripts = async () => {
  try {
    const packageJsonPath = path.join(root, "package.json");
    
    // Read and parse package.json
    const packageJsonContent = await fs.promises.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    
    // Replace scripts section with simple version
    packageJson.scripts = simpleScripts;
    
    // Write back with proper formatting (2 space indent)
    const updatedContent = JSON.stringify(packageJson, null, 2) + "\n";
    await fs.promises.writeFile(packageJsonPath, updatedContent, "utf8");
    
    console.log("📝 Reset package.json scripts to clean state.");
  } catch (error) {
    console.error(`❌ Error resetting package.json scripts: ${error.message}`);
    throw error;
  }
};

// Allow running as standalone script or being imported
if (require.main === module) {
  resetPackageScripts()
    .then(() => {
      console.log("\n✅ Package scripts reset complete!");
    })
    .catch((error) => {
      console.error(`❌ Error during script execution: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { resetPackageScripts };

