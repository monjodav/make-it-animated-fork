import { View, Text } from "react-native";

type Props = {
  width: number;
  title: string;
  body: string;
};

const MARGIN_BOTTOM = 150;

export const OnboardingPage: React.FC<Props> = ({ width, title, body }) => {
  return (
    <View style={[{ width }]} className="h-full">
      <View
        style={{ marginBottom: MARGIN_BOTTOM }}
        className="flex-1 items-center justify-end px-8 pb-12"
      >
        <Text className="text-white text-4xl text-center">{title}</Text>
        <Text className="text-white text-xl mt-5 text-center">{body}</Text>
      </View>
    </View>
  );
};
