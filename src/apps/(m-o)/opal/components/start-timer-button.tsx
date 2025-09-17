import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle, RadialGradient, Defs, Stop } from "react-native-svg";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

const StartTimerButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={simulatePress}>
      <LinearGradient
        colors={["#039278ff", "#3d953cff"]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 0 }}
        style={styles.gradient}
      >
        <View className="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0">
          <Svg height="900" width="900">
            <Defs>
              <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="50%" stopColor="#ffffff00" stopOpacity="0" />
                <Stop offset="90%" stopColor="#000000" stopOpacity="0.9" />
              </RadialGradient>
            </Defs>
            <Circle cx="450" cy="822" r="450" fill="url(#grad)" />
          </Svg>
        </View>
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-1.5 items-center justify-center">
          <Ionicons name="play" size={20} color="#fff" />
          <Text className="text-white text-xl font-medium">Start Timer</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default StartTimerButton;

const styles = StyleSheet.create({
  gradient: {
    borderWidth: 1,
    borderColor: "#333333",
    height: 55,
    borderRadius: 50,
    marginHorizontal: 12,
    marginBottom: 15,
  },
});
