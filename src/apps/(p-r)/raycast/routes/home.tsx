import React, { FC } from "react";
import { View } from "react-native";
import { CustomHeader } from "../components/home/custom-header";
import { Favorites } from "../components/home/favorites";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeAnimationProvider } from "../lib/providers/home-animation";
import { AnimatedBlur } from "../components/home/animated-blur";
import { CommandsList } from "../components/home/commands-list";
import { Searchbar } from "../components/home/searchbar";
import { CancelButton } from "../components/home/cancel-button";
import { useHeaderHeight } from "../lib/hooks/use-header-height";
import { AnimatedChevron } from "../components/home/animated-chevron";

export const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const { insetTop } = useHeaderHeight();

  return (
    <HomeAnimationProvider>
      <View className="flex-1 bg-neutral-900">
        <CustomHeader />
        <Favorites />
        <View
          className="absolute left-5 right-5 h-[100px] rounded-[24px] bg-neutral-200/10 mb-2"
          style={{ bottom: insets.bottom + 8 }}
        />
        <AnimatedBlur />
        <CommandsList />
        <View
          className="absolute w-full flex-row items-center justify-end"
          style={{ top: insetTop }}
        >
          <Searchbar />
          <CancelButton />
        </View>
        <AnimatedChevron />
      </View>
    </HomeAnimationProvider>
  );
};
