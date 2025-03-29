import { useEffect } from "react";
import * as Updates from "expo-updates";
import { MANUAL_ERROR_CAPTURE } from "../utils/sentry";
import { Alert } from "react-native";

export const useOtaUpdate = () => {
  const { isUpdateAvailable } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdateAvailable) {
      Updates.fetchUpdateAsync()
        .then(() =>
          Alert.alert(
            "Update Available",
            "We've added new animations that are ready for you to use! The app needs a quick refresh to load these animations (no download required).",
            [
              {
                text: "Refresh",
                onPress: () => Updates.reloadAsync(),
              },
              {
                text: "Later",
                style: "cancel",
                onPress: () => {},
              },
            ]
          )
        )
        .catch((error) => {
          MANUAL_ERROR_CAPTURE({
            title: "useOtaUpdate > Failed",
            error,
          });
        });
    }
  }, [isUpdateAvailable]);
};
