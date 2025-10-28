import { PropsWithChildren } from "react";
import { View, Text, useWindowDimensions } from "react-native";

type Props = {
  title: string;
  description: string;
};

export const OnboardingSlideContainer: React.FC<PropsWithChildren<Props>> = ({
  title,
  description,
  children,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="h-full px-5">
      <View className="h-1/2">{children}</View>
      <View className="h-1/2 items-center justify-center">
        <Text className="text-zinc-50 text-4xl text-center">{title}</Text>
        <Text className="text-zinc-300 text-xl mt-5 text-center">{description}</Text>
      </View>
    </View>
  );
};
