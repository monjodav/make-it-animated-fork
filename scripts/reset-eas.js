#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script removes eas.json if it exists.
 * Can be run independently or as part of reset-project.js
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const resetEas = async () => {
  try {
    // Remove eas.json if it exists
    const easJsonPath = path.join(root, "eas.json");
    if (fs.existsSync(easJsonPath)) {
      await fs.promises.rm(easJsonPath);
      console.log("❌ eas.json deleted.");
    } else {
      console.log("➡️ eas.json does not exist, skipping.");
    }
  } catch (error) {
    console.error(`❌ Error resetting EAS config: ${error.message}`);
    throw error;
  }
};

// Allow running as standalone script or being imported
if (require.main === module) {
  resetEas()
    .then(() => {
      console.log("\n✅ EAS config reset complete!");
    })
    .catch((error) => {
      console.error(`❌ Error during script execution: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { resetEas };

