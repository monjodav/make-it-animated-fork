import React, { FC } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { CustomButton } from "../components/custom-button";
import { CircleGauge, Store, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Account: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#1C1D24]">
      <View className="h-[130px] px-4 bg-[#737C8B]" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row gap-2 self-end">
          <View className="w-8 h-8 rounded-full bg-[#353940]" />
          <View className="w-16 h-8 rounded-full bg-[#353940]" />
          <View className="w-8 h-8 rounded-full bg-[#353940]" />
        </View>
        <View className="absolute left-4 -bottom-[45px] w-[90px] h-[90px] rounded-full bg-[#737C8B] border-[6px] border-[#1C1D24]" />
      </View>

      <View className="p-4 pt-[60px]">
        <View className=" h-5 w-20 rounded-full bg-[#C7C8CE]/10 mb-3" />
        <View className=" h-5 w-28 rounded-full bg-[#C7C8CE]/10 mb-8" />
        <View className=" h-[45px] rounded-full bg-[#5865F2]/50 mb-7" style={styles.borderCurve} />
        <View className="gap-5">
          <View className="p-[1.5px] rounded-2xl" style={styles.borderCurve}>
            <LinearGradient
              colors={["#9944F5", "#3442D9"]}
              style={[StyleSheet.absoluteFill, styles.gradient]}
            />
            <View className="p-4 gap-5 rounded-[14.5px] bg-[#25272F]" style={styles.borderCurve}>
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-[#C7C8CE]">Amp up your profile</Text>
                <X size={20} color="#C7C8CE" />
              </View>
              <View className="flex-row gap-4">
                {/* discord-button-shimmer-effect-animation 🔽 */}
                <CustomButton withShimmer onPress={() => Alert.alert("Get Nitro")}>
                  <CircleGauge size={16} color="#C7C8CE" />
                  <Text className="font-semibold text-[#C7C8CE]">Get Nitro</Text>
                </CustomButton>
                {/* discord-button-shimmer-effect-animation 🔼 */}
                <CustomButton onPress={() => Alert.alert("Shop")}>
                  <Store size={16} color="#C7C8CE" />
                  <Text className="font-semibold text-[#C7C8CE]">Shop</Text>
                </CustomButton>
              </View>
            </View>
          </View>
          <View className=" h-[70px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
          <View className=" h-[50px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
          <View className=" h-[50px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
  gradient: {
    borderRadius: 16,
    borderCurve: "continuous",
  },
});
