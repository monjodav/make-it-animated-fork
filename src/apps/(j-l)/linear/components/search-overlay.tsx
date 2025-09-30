import { useRef, useEffect } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useSearch } from "../lib/providers/search-provider";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Search, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export const SearchOverlay = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const translateYDistance = height * 0.07;

  const { searchProgress, closeSearch } = useSearch();
  const inputRef = useRef<TextInput>(null);
  const keyboardHeight = useSharedValue(0);

  const inputReveal = useSharedValue(0);
  const prevProgress = useSharedValue(0);

  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      const h = e.endCoordinates?.height ?? 0;
      const duration = e.duration ?? 300;

      inputReveal.set(0);
      keyboardHeight.set(withTiming(h, { duration }));

      const delay = duration;
      setTimeout(() => {
        inputReveal.set(
          withTiming(1, {
            duration: duration,
          })
        );
      }, delay / 3);
    };

    const onHide = (e: any) => {
      const duration = e?.duration ?? 200;
      inputReveal.set(withTiming(0, { duration: duration * 0.5 }));
      keyboardHeight.set(withTiming(0, { duration }));
    };
    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  useDerivedValue(() => {
    const prev = prevProgress.get();
    const curr = searchProgress.get();

    if (prev < 0.5 && curr >= 0.5) runOnJS(focus)();

    if (prev > 0.05 && curr <= 0.05) runOnJS(blur)();
    prevProgress.set(curr);
  });

  const _renderListItem = () => (
    <View className="flex-row px-5 py-3 items-center gap-4">
      <View className="h-10 w-10 rounded-full bg-linear-front" />
      <View className="h-4 w-[150] mt-2 rounded-full bg-linear-front" />
    </View>
  );

  const rContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(searchProgress.get(), [0, 1], [translateYDistance, 0]);
    const scale = interpolate(searchProgress.get(), [0, 1], [0.96, 1]);
    const opacity = interpolate(searchProgress.get(), [0, 1], [0, 1]);

    return {
      transform: [
        {
          translateY,
        },
        {
          scale,
        },
      ],
      opacity,
      pointerEvents: searchProgress.get() === 1 ? "auto" : "none",
    };
  });

  const rInputBarStyle = useAnimatedStyle(() => {
    const finalY = -keyboardHeight.get() - 0;
    const startY = -keyboardHeight.get() + 40;
    const translateY = startY + (finalY - startY) * inputReveal.get();
    const opacity = interpolate(inputReveal.get(), [0, 1], [0, 1]);
    return {
      transform: [{ translateY }],
      opacity,
      pointerEvents: inputReveal.get() === 1 ? "auto" : "none",
    };
  });

  return (
    <Animated.View style={[{ marginTop: insets.top }, StyleSheet.absoluteFill, rContainerStyle]}>
      <Animated.View
        className="absolute left-0 right-0 bottom-0 z-10 flex-row items-center p-2 pb-5 gap-2"
        style={[rInputBarStyle]}
      >
        <LinearGradient
          colors={["transparent", "#0A090C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.2 }}
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row flex-1 items-center bg-[#282828] p-3 rounded-xl gap-2">
          <Search size={20} color="#c3c3c3" />
          <TextInput
            ref={inputRef}
            placeholder="Quick find"
            placeholderTextColor="#888"
            returnKeyType="search"
            className="flex-1"
            onSubmitEditing={closeSearch}
          />
        </View>

        <Pressable
          className="bg-[#282828] p-3 rounded-xl"
          onPress={() => {
            inputRef.current?.blur();
            closeSearch();
          }}
        >
          <X size={20} color="#c3c3c3" />
        </Pressable>
      </Animated.View>

      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={_renderListItem}
        contentContainerClassName="pt-3"
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      />
    </Animated.View>
  );
};
