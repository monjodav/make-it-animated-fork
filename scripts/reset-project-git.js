#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script orchestrates the git workflow for resetting the project:
 * 1. Checks if working directory is clean
 * 2. Stashes current state
 * 3. Runs reset-project script
 * 4. Commits changes with "chore: reset project for public release"
 * 5. Restores original code from stash
 * 6. Commits restored code with "chore: reset project for dev purposes"
 */

const { execSync } = require("child_process");
const STASH_MESSAGE = "reset-project-git-temp-stash";

/**
 * Executes a git command and returns the output
 * @param {string} command - Git command to execute
 * @returns {string} Command output
 */
const gitCommand = (command) => {
  try {
    return execSync(`git ${command}`, { encoding: "utf-8", stdio: "pipe" }).trim();
  } catch (error) {
    throw new Error(`Git command failed: ${error.message}`);
  }
};

/**
 * Checks if the working directory is clean
 * @returns {boolean} True if clean, false otherwise
 */
const isWorkingDirectoryClean = () => {
  try {
    const status = gitCommand("status --porcelain");
    return status === "";
  } catch (error) {
    console.error(`❌ Error checking git status: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Creates a stash with a specific message
 * @param {string} message - Stash message
 */
const createStash = (message) => {
  try {
    gitCommand(`stash push -m "${message}"`);
    console.log(`✅ Stashed current state with message: "${message}"`);
  } catch (error) {
    throw new Error(`Failed to create stash: ${error.message}`);
  }
};

/**
 * Applies and removes the stash
 */
const popStash = () => {
  try {
    gitCommand("stash pop");
    console.log("✅ Restored original code from stash");
  } catch (error) {
    throw new Error(`Failed to pop stash: ${error.message}`);
  }
};

/**
 * Stages all changes and commits with a message
 * @param {string} message - Commit message
 */
const commitChanges = (message) => {
  try {
    gitCommand("add -A");
    gitCommand(`commit -m "${message}"`);
    console.log(`✅ Committed changes: "${message}"`);
  } catch (error) {
    throw new Error(`Failed to commit: ${error.message}`);
  }
};

/**
 * Runs the reset-project npm script
 */
const runResetProject = () => {
  try {
    console.log("🔄 Running reset-project script...\n");
    execSync("npm run reset-project", { stdio: "inherit" });
    console.log("\n✅ Reset-project script completed");
  } catch (error) {
    throw new Error(`Failed to run reset-project: ${error.message}`);
  }
};

/**
 * Main execution function
 */
const main = async () => {
  try {
    console.log("🚀 Starting git reset workflow...\n");

    // Step 1: Check if working directory is clean
    console.log("📋 Checking if working directory is clean...");
    if (!isWorkingDirectoryClean()) {
      console.error("❌ Working directory is not clean. Please commit or stash your changes first.");
      process.exit(1);
    }
    console.log("✅ Working directory is clean\n");

    // Step 2: Stash current state
    console.log("📦 Stashing current state...");
    createStash(STASH_MESSAGE);
    console.log();

    // Step 3: Run reset-project script
    runResetProject();
    console.log();

    // Step 4: Commit reset changes
    console.log("📝 Committing reset changes for public release...");
    commitChanges("chore: reset project for public release");
    console.log();

    // Step 5: Restore original code
    console.log("🔄 Restoring original code from stash...");
    popStash();
    console.log();

    // Step 6: Commit restored code
    console.log("📝 Committing restored code for dev purposes...");
    commitChanges("chore: reset project for dev purposes");
    console.log();

    console.log("✅ Git reset workflow completed successfully!");
  } catch (error) {
    console.error(`❌ Error during workflow execution: ${error.message}`);
    console.error("\n⚠️  You may need to manually restore your working directory:");
    console.error(`   git stash list`);
    console.error(`   git stash pop`);
    process.exit(1);
  }
};

main();

