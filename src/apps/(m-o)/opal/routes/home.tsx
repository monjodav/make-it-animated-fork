import { FC } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StartTimerButton from "../components/start-timer-button";

export const Home: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 pb-2 bg-black justify-end" style={{ paddingTop: insets.top }}>
      {/* opal-start-timer-button-animation 🔽 */}
      <StartTimerButton />
      {/* opal-start-timer-button-animation 🔼 */}
    </View>
  );
};
