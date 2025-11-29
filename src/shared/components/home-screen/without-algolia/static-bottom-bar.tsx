import { FC } from "react";
import { View, Pressable, StyleSheet, TextInput, Platform } from "react-native";
import { Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fireHaptic } from "../../../lib/utils/fire-haptic";
import { useWarmUpBrowser } from "../../../lib/hooks/use-warm-up-browser";
import { GetCode } from "../bottom-bar/get-code";
import { QrScannerButton } from "../bottom-bar/qr-scanner-button";
import { useAnimationsStore } from "@/src/shared/lib/store/animations";

type BottomBarProps = {
  textInputRef: React.RefObject<TextInput | null>;
};

export const StaticBottomBar: FC<BottomBarProps> = ({ textInputRef }) => {
  useWarmUpBrowser();

  const insets = useSafeAreaInsets();

  const value = useAnimationsStore.use.query();

  const hasSearch = value.trim().length > 0;

  return (
    <View
      className="px-[23px] border-t border-neutral-700/75"
      style={{
        paddingTop: 12,
        paddingBottom: insets.bottom + (Platform.OS === "ios" ? 6 : 12),
        borderTopWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View className="flex-row items-center justify-between h-12">
        <View className="absolute left-0 right-0 items-center justify-center">
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
                {hasSearch && (
                  <View className="absolute -top-1 -right-1 size-2.5 bg-brand rounded-full" />
                )}
              </View>
            </Pressable>
          </View>
        </View>
        <GetCode />
        <QrScannerButton />
      </View>
    </View>
  );
};
