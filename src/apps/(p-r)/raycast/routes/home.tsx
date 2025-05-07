import React, { FC } from "react";
import { View } from "react-native";
import { DummyHeader } from "../components/home/custom-header/dummy-header";
import { Favorites } from "../components/home/favorites";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeAnimationProvider } from "../lib/providers/home-animation";
import { AnimatedBlur } from "../components/home/animated-blur";
import { CommandsList } from "../components/home/commands-list";
import { AnimatedChevron } from "../components/home/animated-chevron";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";
import { RealHeader } from "../components/home/custom-header/real-header";

// raycast-home-search-transition-animation 🔽

export const Home: FC = () => {
  useAndroidNote(
    "Android doesn't support scroll in negative direction, so the animation is limited. Blur is still experimental on Android; to avoid performance issues, use a solid background color instead of blur."
  );

  const insets = useSafeAreaInsets();

  return (
    <HomeAnimationProvider>
      <View className="flex-1 bg-neutral-900">
        <Favorites />
        <DummyHeader />
        <View
          className="absolute left-5 right-5 h-[100px] rounded-[24px] bg-neutral-200/10 mb-2"
          style={{ bottom: insets.bottom + 8 }}
        />
        <AnimatedBlur />
        <CommandsList />
        <AnimatedChevron />
        <RealHeader />
      </View>
    </HomeAnimationProvider>
  );
};

// raycast-home-search-transition-animation 🔼
