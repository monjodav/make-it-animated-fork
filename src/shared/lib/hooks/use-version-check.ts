import Constants from "expo-constants";
import { useEffect } from "react";
import { getAppInfoFromTheStore, shouldUpdateApp } from "../utils/version-check";
import { Alert, Platform } from "react-native";
import * as Linking from "expo-linking";
import { MANUAL_ERROR_CAPTURE } from "../utils/sentry";
import { APP_STORE_URL, PLAY_MARKET_URL } from "../constants/links";

export const useVersionCheck = () => {
  const linkToStore = () => {
    const storeLink = Platform.select({
      ios: APP_STORE_URL,
      android: PLAY_MARKET_URL,
    });

    if (storeLink) {
      Linking.openURL(storeLink);
    }
  };

  const checkForUpdate = async () => {
    try {
      const result = await getAppInfoFromTheStore();
      const newestVersion = result?.version;
      const installedVersion = Constants.expoConfig?.version;
      if (installedVersion && newestVersion && shouldUpdateApp(installedVersion, newestVersion)) {
        if (__DEV__) {
          Alert.alert(
            "New Version Available",
            "Please pull the latest changes from the repository.",
            [
              {
                text: "Got it",
                isPreferred: true,
                onPress: () => null,
              },
            ]
          );
        } else {
          Alert.alert(
            "New Version Available",
            "Please update the app to get the latest animations and features.",
            [
              {
                text: "Download Now",
                isPreferred: true,
                onPress: () => linkToStore(),
              },
            ]
          );
        }
      }
    } catch (error) {
      MANUAL_ERROR_CAPTURE({
        title: "useVersionCheck > Failed",
        error,
      });
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);
};
