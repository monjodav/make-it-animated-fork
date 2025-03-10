import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { getAppInfoFromTheStore, shouldUpdateApp } from "../utils/version-check";
import { Platform } from "react-native";
import { STORE_LINKS } from "../constants/store-links";
import * as Linking from "expo-linking";
import { MANUAL_ERROR_CAPTURE } from "../utils/sentry";

export const useVersionCheck = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const result = await getAppInfoFromTheStore();
        const newestVersion = result?.version;
        const installedVersion = Constants.expoConfig?.version;
        if (installedVersion && newestVersion && shouldUpdateApp(installedVersion, newestVersion)) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        MANUAL_ERROR_CAPTURE({
          title: "useVersionCheck > Failed",
          error,
        });
      }
    };

    checkForUpdate();
  }, []);

  const linkToStore = () => {
    const storeLink = Platform.select({
      ios: STORE_LINKS.IOS,
      android: STORE_LINKS.ANDROID,
    });

    if (storeLink) {
      Linking.openURL(storeLink);
    }
  };

  return { isUpdateAvailable, linkToStore };
};
