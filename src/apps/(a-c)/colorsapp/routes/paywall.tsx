import React, { FC, useState } from "react";
import { ScrollView, View } from "react-native";
import { UpgradeToProModal } from "../components/upgrade-to-pro-modal";
import { Header } from "../components/paywall/header";
import { useWindowDimensions } from "react-native";

export const Paywall: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { width, height } = useWindowDimensions();

  return (
    <View className="flex-1 bg-[#16131B]">
      <Header onUpgradeToProPress={() => setIsModalVisible(true)} />
      <ScrollView
        contentContainerClassName="px-4 pt-16 gap-4"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            style={{ width: width * 0.6, height: height * 0.45 }}
            className="border border-[#231E2B] bg-[#1B1721] rounded-3xl"
          />
        ))}
      </ScrollView>
      {/* colorsapp-upgrade-to-pro-modal-animation 🔽 */}
      <UpgradeToProModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
      {/* colorsapp-upgrade-to-pro-modal-animation 🔼 */}
    </View>
  );
};
