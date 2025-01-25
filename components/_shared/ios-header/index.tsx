import React, { FC } from "react";
import { View } from "react-native";
import { SearchBar } from "./search-bar";
import { BigTitle } from "./big-title";
import { HeaderContainer } from "./header-container";
import { SmallTitle } from "./small-title";
import { ContentContainer } from "./content-container";
import { BlurBg } from "./blur-bg";
import { SmallTitleContainer } from "./small-title-container";
import { BigTitleAndSearchbarContainer } from "./big-title-and-searchbar-container";

type Props = {
  smallTitle?: string;
  bigTitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  hideSearchBar?: boolean;
  hideSearchBarOnScroll?: boolean;
  bgColor?: string;
  withBlur?: boolean;
};

export const IosHeader: FC<Props> = ({
  smallTitle,
  bigTitle,
  left,
  right,
  bottom,
  hideSearchBar = false,
  hideSearchBarOnScroll = true,
  bgColor = "#000000",
  withBlur = true,
}) => {
  return (
    <HeaderContainer hideSearchBarOnScroll={hideSearchBarOnScroll}>
      <SmallTitleContainer
        bgColor={bgColor}
        withBlur={withBlur}
        hideSearchBarOnScroll={hideSearchBarOnScroll}
      >
        <View className="absolute left-0">{left}</View>
        <SmallTitle smallTitle={smallTitle} hideSearchBarOnScroll={hideSearchBarOnScroll} />
        <View className="absolute right-0">{right}</View>
      </SmallTitleContainer>
      <ContentContainer hideSearchBarOnScroll={hideSearchBarOnScroll} bgColor={bgColor}>
        <BigTitleAndSearchbarContainer hideSearchBarOnScroll={hideSearchBarOnScroll}>
          {bigTitle && <BigTitle bigTitle={bigTitle} />}
          {!hideSearchBar && <SearchBar hideSearchBarOnScroll={hideSearchBarOnScroll} />}
        </BigTitleAndSearchbarContainer>
        {bottom}
      </ContentContainer>
    </HeaderContainer>
  );
};
