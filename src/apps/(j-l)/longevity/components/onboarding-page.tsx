import { View, Text, StyleSheet } from "react-native";

type Props = {
  width: number;
  title: string;
  body: string;
  topOffset: number;
};

export const OnboardingPage: React.FC<Props> = ({ width, title, body, topOffset }) => {
  return (
    <View style={[{ width }]} className="h-full">
      <View style={[StyleSheet.absoluteFill, { top: topOffset }]} className="items-center px-8">
        <Text className="text-white text-4xl text-center">{title}</Text>
        <Text className="text-white text-xl mt-5 text-center">{body}</Text>
      </View>
    </View>
  );
};
