import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { getAppInfoFromTheStore, shouldUpdateApp } from "../utils/version-check";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { MANUAL_ERROR_CAPTURE } from "../utils/sentry";
import { APP_STORE_URL, PLAY_MARKET_URL } from "../constants/links";

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
      ios: APP_STORE_URL,
      android: PLAY_MARKET_URL,
    });

    if (storeLink) {
      Linking.openURL(storeLink);
    }
  };

  return { isUpdateAvailable, linkToStore };
};
