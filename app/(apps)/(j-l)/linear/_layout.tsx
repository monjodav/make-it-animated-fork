import { Stack, useRouter } from "expo-router";
import { createContext } from "react";
import { KeyboardController } from "react-native-keyboard-controller";
import { SharedValue, useSharedValue, withSpring } from "react-native-reanimated";

const DURATION = 700;

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
    transitionProgress.set(withSpring(1, { duration: DURATION }));
    router.push("/linear/search-modal");
  };

  const onCloseSearchModal = () => {
    transitionProgress.set(withSpring(2, { duration: DURATION }, () => transitionProgress.set(0)));
    KeyboardController.dismiss();
    setTimeout(() => {
      router.back();
    }, DURATION / 1.5);
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
            animationDuration: 250,
          }}
        />
      </Stack>
    </SearchTransitionContext>
  );
}
