#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script is used to reset the project to a blank state.
 * It orchestrates multiple reset scripts:
 * - reset-app-config.js: Removes app.config.ts and creates app.json
 * - reset-eas.js: Removes eas.json
 * - reset-index.js: Resets app/index.tsx to clean state
 * - reset-layout.js: Resets app/_layout.tsx to clean state
 * - reset-package-scripts.js: Resets package.json scripts to clean state
 * - Removes scripts folder (runs last)
 * 
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 * Individual reset scripts can also be run independently if needed.
 */

const fs = require("fs");
const path = require("path");

const { resetAppConfig } = require("./reset-app-config");
const { resetEas } = require("./reset-eas");
const { resetIndex } = require("./reset-index");
const { resetLayout } = require("./reset-layout");
const { resetPackageScripts } = require("./reset-package-scripts");

const root = process.cwd();

const resetProject = async () => {
  try {
    console.log("🔄 Starting project reset...\n");

    // Reset app configuration (removes app.config.ts and creates app.json)
    await resetAppConfig();
    console.log();

    // Reset EAS configuration (removes eas.json)
    await resetEas();
    console.log();

    // Reset index.tsx to clean state
    await resetIndex();
    console.log();

    // Reset _layout.tsx to clean state
    await resetLayout();
    console.log();

    // Reset package.json scripts to clean state
    await resetPackageScripts();
    console.log();

    // Remove scripts folder (must run last)
    const scriptsPath = path.join(root, "scripts");
    if (fs.existsSync(scriptsPath)) {
      await fs.promises.rm(scriptsPath, { recursive: true, force: true });
      console.log("❌ scripts folder deleted.");
    } else {
      console.log("➡️ scripts folder does not exist, skipping.");
    }
    console.log();

    console.log("✅ Project reset complete!");
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
    process.exit(1);
  }
};

resetProject();
