import React, { FC, useCallback, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import LanguageItem from "../components/language-item";
import { LanguageType } from "../lib/types";
import { useIOSNote } from "@/src/shared/lib/hooks/use-ios-note";

// Mock data generation for demo - simulates language selection list
const languages: LanguageType[] = Array.from({ length: 20 }).map((_, index) => ({
  id: index,
  name: `Language ${index + 1}`,
}));

export const Language: FC = () => {
  useIOSNote(
    "On iOS 26 there is a known issue with the header layout. The fix is ready and the app is awaiting review to release a new version. Sorry for the inconvenience."
  );

  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(languages[2]);

  // Memoized handler prevents unnecessary re-renders of list items
  // Critical for performance with animated components
  const handleListItemPress = useCallback(
    (language: LanguageType) => setCurrentLanguage(language),
    []
  );

  return (
    <ScrollView
      className="flex-1 bg-[#1C1D24]"
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-[#25272F] rounded-3xl overflow-hidden" style={styles.borderCurve}>
        {/* discord-language-radio-button-animation 🔽 */}
        {languages.map((language, index) => (
          <React.Fragment key={language.id}>
            <LanguageItem
              data={language}
              onPress={handleListItemPress}
              selected={language.id === currentLanguage.id}
            />
            {index < languages.length - 1 && <View className="h-[0.5px] bg-white/10 ml-16" />}
          </React.Fragment>
        ))}
        {/* discord-language-radio-button-animation 🔼 */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
