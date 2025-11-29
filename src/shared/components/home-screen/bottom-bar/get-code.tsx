import { FC } from "react";
import { View, Pressable } from "react-native";
import { AppText } from "../../app-text";
import { fireHaptic } from "../../../lib/utils/fire-haptic";
import { useWarmUpBrowser } from "../../../lib/hooks/use-warm-up-browser";
import { WEBSITE_URL } from "../../../lib/constants/links";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import * as WebBrowser from "expo-web-browser";
import { IS_ALGOLIA_ENABLED } from "@/src/shared/lib/constants/base";

export const GetCode: FC = () => {
  useWarmUpBrowser();

  const url = IS_ALGOLIA_ENABLED ? `${WEBSITE_URL}/pricing` : WEBSITE_URL;

  return (
    <Pressable
      onPress={() => {
        fireHaptic();
        WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowserPresentationStyle.FORM_SHEET,
        });
      }}
    >
      <View className="flex-row gap-1 items-baseline">
        <AppText className="text-lg">{IS_ALGOLIA_ENABLED ? "Get code" : "Website"}</AppText>
        <View className="size-2 rounded-full bg-brand translate-y-0.5" />
      </View>
    </Pressable>
  );
};
