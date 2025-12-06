#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script orchestrates the git workflow for resetting the project:
 * 1. Checks if working directory is clean
 * 2. Saves current HEAD commit hash
 * 3. Runs reset-project script
 * 4. Commits changes with "chore: reset project for public release"
 * 5. Restores original code from saved commit hash
 * 6. Commits restored code with "chore: reset project for dev purposes"
 */

const { execSync } = require("child_process");

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
 * Gets the current HEAD commit hash
 * @returns {string} Commit hash
 */
const getHeadCommitHash = () => {
  try {
    const commitHash = gitCommand("rev-parse HEAD");
    if (!commitHash || commitHash.trim() === "") {
      throw new Error("Failed to get HEAD commit hash");
    }
    return commitHash.trim();
  } catch (error) {
    throw new Error(`Failed to get HEAD commit hash: ${error.message}`);
  }
};

/**
 * Restores all files from a specific commit
 * @param {string} commitHash - Commit hash to restore from
 */
const restoreFromCommit = (commitHash) => {
  try {
    // Checkout all files from the specified commit
    gitCommand(`checkout ${commitHash} -- .`);
    console.log(`✅ Restored original code from commit ${commitHash.substring(0, 7)}`);
  } catch (error) {
    throw new Error(`Failed to restore from commit: ${error.message}`);
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

    // Step 2: Save current HEAD commit hash
    console.log("📦 Saving current HEAD commit hash...");
    const originalCommitHash = getHeadCommitHash();
    console.log(`✅ Saved HEAD commit: ${originalCommitHash.substring(0, 7)}\n`);

    // Step 3: Run reset-project script
    runResetProject();
    console.log();

    // Step 4: Commit reset changes
    console.log("📝 Committing reset changes for public release...");
    commitChanges("chore: reset project for public release");
    console.log();

    // Step 5: Restore original code from saved commit
    console.log("🔄 Restoring original code from saved commit...");
    restoreFromCommit(originalCommitHash);
    console.log();

    // Step 6: Commit restored code
    console.log("📝 Committing restored code for dev purposes...");
    commitChanges("chore: reset project for dev purposes");
    console.log();

    console.log("✅ Git reset workflow completed successfully!");
  } catch (error) {
    console.error(`❌ Error during workflow execution: ${error.message}`);
    console.error("\n⚠️  You may need to manually restore your working directory:");
    console.error(`   git log --oneline -n 5`);
    console.error(`   git checkout <commit-hash> -- .`);
    process.exit(1);
  }
};

main();
