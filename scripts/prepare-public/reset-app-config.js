#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script removes app.config.ts and creates app.json with basic configuration for public branch.
 * Can be run independently or as part of prepare-public.js
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

const resetAppConfig = async () => {
  try {
    // Remove app.config.ts if it exists
    const appConfigPath = path.join(root, "app.config.ts");
    if (fs.existsSync(appConfigPath)) {
      await fs.promises.rm(appConfigPath);
      console.log("❌ app.config.ts deleted.");
    } else {
      console.log("➡️ app.config.ts does not exist, skipping.");
    }

    // Create app.json with specified content
    const appJsonPath = path.join(root, "app.json");
    await fs.promises.writeFile(appJsonPath, JSON.stringify(appJsonContent, null, 2) + "\n");
    console.log("📝 Created app.json with specified configuration.");
  } catch (error) {
    console.error(`❌ Error resetting app config: ${error.message}`);
    throw error;
  }
};

// Allow running as standalone script or being imported
if (require.main === module) {
  resetAppConfig()
    .then(() => {
      console.log("\n✅ App config reset complete!");
    })
    .catch((error) => {
      console.error(`❌ Error during script execution: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { resetAppConfig };

