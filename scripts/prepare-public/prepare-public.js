#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script is used to prepare specific files and code for public branch.
 * It orchestrates multiple reset scripts:
 * - reset-app-config.js: Removes app.config.ts and creates app.json for public branch
 * - reset-eas.js: Removes eas.json for public branch
 * - reset-index.js: Resets app/index.tsx to clean state for public branch
 * - reset-layout.js: Resets app/_layout.tsx to clean state for public branch
 * - reset-package-scripts.js: Resets package.json scripts to clean state for public branch
 * 
 * Individual reset scripts can also be run independently if needed.
 */

const fs = require("fs");
const path = require("path");
const { resetAppConfig } = require("./reset-app-config");
const { resetEas } = require("./reset-eas");
const { resetIndex } = require("./reset-index");
const { resetLayout } = require("./reset-layout");
const { resetPackageScripts } = require("./reset-package-scripts");

const preparePublic = async () => {
  try {
    console.log("🔄 Starting preparation for public branch...\n");

    // Prepare app configuration for public branch (removes app.config.ts and creates app.json)
    await resetAppConfig();
    console.log();

    // Prepare EAS configuration for public branch (removes eas.json)
    await resetEas();
    console.log();

    // Prepare index.tsx to clean state for public branch
    await resetIndex();
    console.log();

    // Prepare _layout.tsx to clean state for public branch
    await resetLayout();
    console.log();

    // Prepare package.json scripts to clean state for public branch
    await resetPackageScripts();
    console.log();

    // Remove scripts folder at the end
    const scriptsFolderPath = path.join(process.cwd(), "scripts");
    if (fs.existsSync(scriptsFolderPath)) {
      fs.rmSync(scriptsFolderPath, { recursive: true, force: true });
      console.log("🗑️  Removed scripts folder");
    }

    console.log("✅ Preparation for public branch complete!");
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
    process.exit(1);
  }
};

preparePublic();

