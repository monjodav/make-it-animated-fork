import { useEffect } from "react";
import * as Updates from "expo-updates";
import { MANUAL_ERROR_CAPTURE } from "../utils/sentry";

export const useUpdate = () => {
  const { isUpdateAvailable } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdateAvailable) {
      Updates.fetchUpdateAsync()
        .then(() => {
          Updates.reloadAsync();
        })
        .catch((error) => {
          MANUAL_ERROR_CAPTURE({
            title: "useUpdate > Failed",
            error,
          });
        });
    }
  }, [isUpdateAvailable]);
};
