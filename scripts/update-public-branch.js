#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script orchestrates the git workflow for updating the public branch:
 * 1. Checks if working directory is clean
 * 2. Saves current HEAD commit hash
 * 3. Runs prepare-public script
 * 4. Commits changes with "chore: prepare public branch"
 * 5. Pushes code from main to public branch with force
 * 6. Restores original code from saved commit hash
 * 7. Commits restored code with "chore: restore main branch"
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
 * Gets the list of files tracked in a specific commit
 * @param {string} commitHash - Commit hash
 * @returns {string[]} Array of file paths
 */
const getTrackedFiles = (commitHash) => {
  try {
    const files = gitCommand(`ls-tree -r --name-only ${commitHash}`);
    return files.split("\n").filter((file) => file.trim() !== "");
  } catch (error) {
    throw new Error(`Failed to get tracked files: ${error.message}`);
  }
};

/**
 * Restores all files from a specific commit and removes files that weren't in that commit
 * @param {string} commitHash - Commit hash to restore from
 */
const restoreFromCommit = (commitHash) => {
  try {
    // Get list of files that existed in the original commit
    const originalFiles = getTrackedFiles(commitHash);
    const originalFilesSet = new Set(originalFiles);

    // Checkout all files from the specified commit
    gitCommand(`checkout ${commitHash} -- .`);

    // Get current tracked files
    const currentFiles = gitCommand("ls-files").split("\n").filter((file) => file.trim() !== "");

    // Remove files that exist now but weren't in the original commit
    const filesToRemove = currentFiles.filter((file) => !originalFilesSet.has(file));
    if (filesToRemove.length > 0) {
      filesToRemove.forEach((file) => {
        try {
          gitCommand(`rm ${file}`);
        } catch {
          // File might already be removed or not exist, continue
        }
      });
      console.log(`🗑️  Removed ${filesToRemove.length} file(s) that weren't in original commit`);
    }

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
 * Pushes code from main branch to public branch with force
 */
const pushMainToPublic = () => {
  try {
    console.log("📤 Pushing main to public branch with force...");
    gitCommand("push origin main:public --force");
    console.log("✅ Successfully pushed main to public branch");
  } catch (error) {
    throw new Error(`Failed to push to public branch: ${error.message}`);
  }
};

/**
 * Runs the prepare-public npm script
 */
const runPreparePublic = () => {
  try {
    console.log("🔄 Running prepare-public script...\n");
    execSync("npm run prepare-public", { stdio: "inherit" });
    console.log("\n✅ Prepare-public script completed");
  } catch (error) {
    throw new Error(`Failed to run prepare-public: ${error.message}`);
  }
};

/**
 * Main execution function
 */
const main = async () => {
  try {
    console.log("🚀 Starting public branch update workflow...\n");

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

    // Step 3: Run prepare-public script
    runPreparePublic();
    console.log();

    // Step 4: Commit changes for public branch
    console.log("📝 Committing changes for public branch...");
    commitChanges("chore: prepare public branch");
    console.log();

    // Step 5: Push main to public branch with force
    pushMainToPublic();
    console.log();

    // Step 6: Restore original code from saved commit
    console.log("🔄 Restoring original code from saved commit...");
    restoreFromCommit(originalCommitHash);
    console.log();

    // Step 7: Commit restored code for main branch
    console.log("📝 Committing restored code for main branch...");
    commitChanges("chore: restore main branch");
    console.log();

    console.log("✅ Public branch update workflow completed successfully!");
  } catch (error) {
    console.error(`❌ Error during workflow execution: ${error.message}`);
    console.error("\n⚠️  You may need to manually restore your working directory:");
    console.error(`   git log --oneline -n 5`);
    console.error(`   git checkout <commit-hash> -- .`);
    process.exit(1);
  }
};

main();

