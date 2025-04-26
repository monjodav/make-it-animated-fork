import { useCallback, useEffect, useRef, useState } from "react";
import * as Updates from "expo-updates";
import { MANUAL_ERROR_CAPTURE } from "../utils/sentry";
import { Alert, AppState } from "react-native";

export const updateAlert = {
  title: "Update available",
  message:
    "We've added new animations or important updates that are ready for you to use! The app needs a quick refresh to load these updates (no download required).",
};

export const useOtaUpdate = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const { isUpdateAvailable: isOtaUpdateAvailable } = Updates.useUpdates();

  const appState = useRef(AppState.currentState);

  const handleUpdate = useCallback(async () => {
    if (isOtaUpdateAvailable) {
      Updates.fetchUpdateAsync()
        .then(() =>
          Alert.alert(updateAlert.title, updateAlert.message, [
            {
              text: "Later",
              onPress: () => setIsUpdateAvailable(true),
            },
            {
              text: "Refresh",
              isPreferred: true,
              onPress: () => Updates.reloadAsync(),
            },
          ])
        )
        .catch((error) => {
          MANUAL_ERROR_CAPTURE({
            title: "useOtaUpdate > Failed",
            error,
          });
        });
    }
  }, [isOtaUpdateAvailable]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        setIsUpdateAvailable(false);
        handleUpdate();
      }

      appState.current = nextAppState;
    });

    handleUpdate();

    return () => {
      subscription.remove();
    };
  }, [isOtaUpdateAvailable, handleUpdate]);

  return { isUpdateAvailable };
};
