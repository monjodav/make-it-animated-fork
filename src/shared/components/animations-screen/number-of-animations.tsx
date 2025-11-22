import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useInstantSearch } from "react-instantsearch-core";
import { AppText } from "../app-text";

/**
 * NumberOfAnimations component - displays the total count of animations
 * Uses Algolia's useHits hook to get the total number of results
 */
export const NumberOfAnimations: FC = () => {
  const { results } = useInstantSearch();

  // VS -------------
  // Add here alogic if queary of finlters are applied on ly in this case  "No animations found" can be shown

  // Get the total number of hits from Algolia results
  const count = results?.nbHits ?? 0;

  return (
    <View
      className="px-6 py-3 border-neutral-800"
      style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
    >
      <AppText className="text-center text-base text-muted-foreground font-sans-medium">
        {count === 0 ? "No animations found" : `${count} awesome animations 🌀`}
      </AppText>
    </View>
  );
};
