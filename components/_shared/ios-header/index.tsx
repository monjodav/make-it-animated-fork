import React, { FC } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "./search-bar";
import { BigTitle } from "./big-title";
import { HeaderContainer } from "./header-container";
import { SmallTitle } from "./small-title";
import { ContentContainer } from "./content-container";

export const _bigTitlePaddingTop = 12;

type Props = {
  smallTitle?: string;
  bigTitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  hideSearchBar?: boolean;
  hideSearchBarOnScroll?: boolean;
};

export const IosHeader: FC<Props> = ({
  smallTitle,
  bigTitle,
  left,
  right,
  bottom,
  hideSearchBar = false,
  hideSearchBarOnScroll = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <HeaderContainer hideSearchBarOnScroll={hideSearchBarOnScroll}>
      <View className="bg-black z-[99]" style={{ height: insets.top + 8 }} />
      <View className="px-5 pb-2 flex-row items-center justify-center bg-black z-[99]">
        <View className="absolute left-0">{left}</View>
        <SmallTitle smallTitle={smallTitle} hideSearchBarOnScroll={hideSearchBarOnScroll} />
        <View className="absolute right-0">{right}</View>
      </View>
      <ContentContainer hideSearchBarOnScroll={hideSearchBarOnScroll}>
        <View className="px-1 gap-3" style={{ paddingTop: _bigTitlePaddingTop }}>
          {bigTitle && <BigTitle bigTitle={bigTitle} />}
          {!hideSearchBar && <SearchBar hideSearchBarOnScroll={hideSearchBarOnScroll} />}
        </View>
        {bottom}
      </ContentContainer>
    </HeaderContainer>
  );
};
