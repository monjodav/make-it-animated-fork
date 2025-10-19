#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script is used to reset the project to a blank state.
 * It removes app.config.ts and creates app.json with basic configuration.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const appJsonContent = {
  "name": "Make It Animated",
  "slug": "make-it-animated",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "make-it-animated",
  "userInterfaceStyle": "automatic",
  "icon": "./assets/images/icon-ios.png",
  "ios": {
    "supportsTablet": false,
    "icon": "./assets/images/icon-ios.png",
    "bundleIdentifier": "com.volodymyr-serbulenko.make-it-animated"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/icon-android.png",
      "backgroundColor": "#fffff4"
    },
    "permissions": [
      "android.permission.CAMERA"
    ]
  },
  "plugins": [
    "expo-router",
    "expo-font",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash.png",
        "imageWidth": 150,
        "resizeMode": "contain",
        "backgroundColor": "#171717"
      }
    ],
    [
      "expo-camera",
      {
        "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera"
      }
    ]
  ],
  "experiments": {
    "typedRoutes": true
  },
  "extra": {
    "router": {
      "origin": false
    }
  },
  "owner": "volodymyr_serbulenko"
};

const resetProject = async () => {
  try {
    // Remove app.config.ts if it exists
    const appConfigPath = path.join(root, "app.config.ts");
    if (fs.existsSync(appConfigPath)) {
      await fs.promises.rm(appConfigPath);
      console.log("❌ app.config.ts deleted.");
    } else {
      console.log("➡️ app.config.ts does not exist, skipping.");
    }

    // Remove eas.json if it exists
    const easJsonPath = path.join(root, "eas.json");
    if (fs.existsSync(easJsonPath)) {
      await fs.promises.rm(easJsonPath);
      console.log("❌ eas.json deleted.");
    } else {
      console.log("➡️ eas.json does not exist, skipping.");
    }

    // Create app.json with specified content
    const appJsonPath = path.join(root, "app.json");
    await fs.promises.writeFile(appJsonPath, JSON.stringify(appJsonContent, null, 2) + "\n");
    console.log("📝 Created app.json with specified configuration.");

    console.log("\n✅ Project reset complete!");
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
    process.exit(1);
  }
};

resetProject();
