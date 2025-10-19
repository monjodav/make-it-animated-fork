import { Stack, useRouter } from "expo-router";
import { createContext } from "react";
import { KeyboardController } from "react-native-keyboard-controller";
import { SharedValue, useSharedValue, withSpring } from "react-native-reanimated";

// linear-search-screen-open-close-animation 🔽

// Single source of truth (why): transitionProgress orchestrates open/close across components
// Phases: 0 (idle) → 1 (opening) → 2 (closing) → 0 (reset)
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
    // Kick off opening phase (0→1) to drive background de-emphasis animations
    transitionProgress.set(withSpring(1, { duration: DURATION }));
    router.push("/linear/search-modal");
  };

  const onCloseSearchModal = () => {
    // Closing phase (1→2) with reset to 0 on settle; keeps background anims in sync
    transitionProgress.set(withSpring(2, { duration: DURATION }, () => transitionProgress.set(0)));
    // Dismiss keyboard immediately to avoid IME overlap during close motion
    KeyboardController.dismiss();
    // Navigate back slightly before motion end for snappier UX (2/3 of duration)
    setTimeout(() => {
      router.back();
    }, DURATION / 1.5);
  };

  return (
    <SearchTransitionContext value={{ transitionProgress, onOpenSearchModal, onCloseSearchModal }}>
      {/* Presentation (why): transparent modal allows background motion underlay
          + short native animation avoids fighting with custom Reanimated timing */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#0A090C",
          },
        }}
        initialRouteName="(tabs)"
      >
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

// linear-bottom-tabs-indicator-animation 🔼
