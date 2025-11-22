import { FC, useCallback } from "react";
import { View, Pressable, StyleSheet, TextInput, Platform } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MoreHorizontal, Search, Settings2 } from "lucide-react-native";
import { simulatePress } from "../../lib/utils/simulate-press";
import Octicons from "@expo/vector-icons/Octicons";
import * as Haptics from "expo-haptics";
import { useSearchBox } from "react-instantsearch-core";

type BottomBarProps = {
  textInputRef: React.RefObject<TextInput | null>;
};

export const BottomBar: FC<BottomBarProps> = ({ textInputRef }) => {
  const { bottom } = useSafeAreaInsets();
  const { query } = useSearchBox();

  const fireHaptic = useCallback(() => {
    if (Platform.OS === "android") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <View
      className="flex-row items-center justify-between px-[23px] border-t border-neutral-800"
      style={{
        paddingBottom: bottom + (Platform.OS === "ios" ? 6 : 12),
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View className="absolute top-2 left-0 right-0 items-center justify-center">
        <View
          className="flex-row items-center bg-neutral-800 rounded-2xl shadow-xl shadow-neutral-700/40"
          style={{ borderCurve: "continuous" }}
        >
          <Pressable
            className="py-3 px-4"
            onPress={() => {
              fireHaptic();
              textInputRef.current?.focus();
            }}
          >
            <View>
              <Search size={24} color="#FFFFF5" />
              {query && (
                <View className="absolute -top-1 -right-1 size-2.5 bg-brand rounded-full" />
              )}
            </View>
          </Pressable>
          <View className="h-full py-2">
            <View className="h-full w-[2px] rounded-full bg-neutral-900/50" />
          </View>
          <Pressable className="py-3 px-4" onPress={simulatePress}>
            <View>
              <Settings2 size={24} color="#FFFFF5" />
              {query && (
                <View className="absolute -top-1 -right-1 size-2.5 bg-brand rounded-full" />
              )}
            </View>
          </Pressable>
        </View>
      </View>

      <Link href="/" replace onPress={fireHaptic}>
        <Octicons name="home" size={22} color="#FFFFF5" />
      </Link>

      <Pressable className="p-2" onPress={simulatePress}>
        <MoreHorizontal size={24} color="#FFFFF5" />
      </Pressable>
    </View>
  );
};
