import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import {
  HeaderTitle as HeaderTitleComponent,
  HeaderTitleProps,
  useHeaderHeight,
} from "@react-navigation/elements";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ellipsis, Menu, Search } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

// canva-header-transition-animation 🔽

export default function Projects() {
  const headerHeight = useHeaderHeight();

  const navigation = useNavigation();

  const listRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffsetY = useScrollViewOffset(listRef);
  const rImageHeaderHeight = useSharedValue(200);

  const rInputRange = useDerivedValue(() => {
    const start = rImageHeaderHeight.value * 0.2;
    const end = rImageHeaderHeight.value - headerHeight;
    return [start, end];
  });

  const rHeaderTitleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] ? 1 : 0),
    };
  });

  const rWhiteIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] ? 0 : 1),
    };
  });

  const rBlackIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] ? 1 : 0),
    };
  });

  const rHeaderBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] * 0.95 ? 1 : 0),
    };
  });

  const rImageHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffsetY.value, rInputRange.value, [1, 0], Extrapolation.CLAMP),
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity className="p-3 rounded-lg bg-white">
          <Menu size={18} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: (props: HeaderTitleProps) => {
        return (
          <Animated.View style={rHeaderTitleContainerStyle}>
            <HeaderTitleComponent {...props}>Projects</HeaderTitleComponent>
          </Animated.View>
        );
      },
      headerRight: () => (
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="items-center justify-center h-5 w-5"
            onPress={() => Alert.alert("Search")}
          >
            <Animated.View className="absolute" style={rWhiteIconStyle}>
              <Search size={18} color="white" strokeWidth={2.5} />
            </Animated.View>
            <Animated.View className="absolute" style={rBlackIconStyle}>
              <Search size={18} color="black" strokeWidth={2} />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center h-5 w-5"
            onPress={() => Alert.alert("More")}
          >
            <Animated.View className="absolute" style={rWhiteIconStyle}>
              <Ellipsis size={18} color="white" strokeWidth={3} />
            </Animated.View>
            <Animated.View className="absolute" style={rBlackIconStyle}>
              <Ellipsis size={18} color="black" strokeWidth={3} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      ),
      headerBackground: () => (
        <Animated.View
          style={[StyleSheet.absoluteFill, rHeaderBackgroundStyle]}
          className="bg-white border-b border-stone-200 "
        />
      ),
    });
  }, [
    navigation,
    rBlackIconStyle,
    rHeaderBackgroundStyle,
    rHeaderTitleContainerStyle,
    rWhiteIconStyle,
  ]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      <Animated.ScrollView ref={listRef} bounces={false}>
        <Animated.View
          style={[{ paddingTop: headerHeight }, rImageHeaderStyle]}
          onLayout={(e) => rImageHeaderHeight.set(e.nativeEvent.layout.height)}
        >
          <LinearGradient
            colors={["#042f2e", "#22d3ee"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View className="px-4 py-6">
            <Text className="text-white text-2xl font-bold">Projects</Text>
          </View>
        </Animated.View>
        <View className="p-5 pb-40">
          <View className="flex-row gap-4 mb-8">
            <View className="w-12 h-12 rounded-lg bg-stone-100" />
            <View className="w-[80px] h-12 rounded-lg bg-stone-100" />
            <View className="w-[100px] h-12 rounded-lg bg-stone-100" />
            <View className="w-[100px] h-12 rounded-lg bg-stone-100" />
          </View>
          <View className="w-[150px] h-9 rounded-full bg-stone-100 mb-6" />
          <View className="flex-row gap-4 mb-8">
            <View className="w-[110px] aspect-square rounded-xl bg-stone-100" />
            <View className="w-[110px] aspect-square rounded-xl bg-stone-100" />
            <View className="w-[110px] aspect-square rounded-xl bg-stone-100" />
          </View>
          <View className="w-[120px] h-9 rounded-full bg-stone-100 mb-6" />
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} className="flex-row gap-4 mb-4 items-center justify-center">
              <View className="w-[48%] aspect-square rounded-xl bg-stone-100" />
              <View className="w-[48%] aspect-square rounded-xl bg-stone-100" />
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// canva-header-transition-animation 🔼
