import { FC, RefObject, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { APPS } from "../../../../lib/constants/apps";
import { useAnimationsStore } from "../../../../lib/store/animations";
import { Header } from "../header";
import { BackToTopButton } from "./back-to-top-button";

type Props = {
  listRef: RefObject<FlatList | null>;
};
const Results: FC<Props> = ({ listRef }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const value = useAnimationsStore.use.query();

  const { height: screenHeight } = useWindowDimensions();

  const filteredApps =
    value.trim().length === 0
      ? APPS
      : APPS.filter(
          (app) =>
            app.appName.toLowerCase().includes(value.toLowerCase()) ||
            app.animationName.toLowerCase().includes(value.toLowerCase())
        );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > screenHeight);
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={listRef}
        data={filteredApps}
        keyExtractor={(item) => item.animationName + "-" + item.appName}
        renderItem={({ item, index }) => <Header animation={item} index={index} />}
        contentContainerClassName="pt-5 pb-4 px-5 gap-4"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <Text className="text-white text-2xl text-center mt-10">No results found</Text>
        )}
      />
      <BackToTopButton listRef={listRef} showBackToTop={showBackToTop} />
    </View>
  );
};

export default Results;
