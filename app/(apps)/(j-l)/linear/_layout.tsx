import { Stack, useRouter } from "expo-router";
import { createContext } from "react";
import { KeyboardController } from "react-native-keyboard-controller";
import { SharedValue, useSharedValue, withSpring } from "react-native-reanimated";

interface SearchTransitionContextValue {
  transitionProgress: SharedValue<number>;
  onOpenSearchModal: () => void;
  onCloseSearchModal: () => void;
}

export const SearchTransitionContext = createContext<SearchTransitionContextValue>({
  transitionProgress: 0 as unknown as SharedValue<number>,
  onOpenSearchModal: () => {},
  onCloseSearchModal: () => {},
});

export default function LinearLayout() {
  const transitionProgress = useSharedValue(0);

  const router = useRouter();

  const onOpenSearchModal = () => {
    router.push("/linear/search-modal");
    transitionProgress.set(withSpring(1));
  };

  const onCloseSearchModal = () => {
    transitionProgress.set(withSpring(0));
    router.back();
    setTimeout(() => {
      KeyboardController.dismiss();
    }, 100);
  };

  return (
    <SearchTransitionContext value={{ transitionProgress, onOpenSearchModal, onCloseSearchModal }}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="search-modal"
          options={{
            presentation: "containedTransparentModal",
            animation: "fade_from_bottom",
            animationDuration: 200,
          }}
        />
      </Stack>
    </SearchTransitionContext>
  );
}
