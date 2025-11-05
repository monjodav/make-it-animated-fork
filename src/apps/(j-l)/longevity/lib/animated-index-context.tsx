// longevity-onboarding-animation 🔽

import { createContext } from "react";
import { SharedValue } from "react-native-reanimated";

type AnimatedIndexContextType = {
  activeIndex: SharedValue<number>;
};

export const AnimatedIndexContext = createContext<AnimatedIndexContextType>(
  {} as AnimatedIndexContextType
);

// longevity-onboarding-animation 🔼
