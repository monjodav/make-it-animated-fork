import { FC, useMemo } from "react";
import { Text, View, Image } from "react-native";
import Video from "react-native-video";
import { useAnimationsStore } from "../../../lib/store/animations";

type AnimationCardProps = {
  playback_id: string;
  appTitle: string;
  animationTitle?: string;
  logoUrl: string;
  createdAt: number;
};

const getRandomRotation = () => {
  return Math.floor(Math.random() * 9) - 4;
};

const isLessThanTenDays = (timestamp: number): boolean => {
  const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return now - timestamp < TEN_DAYS_IN_MS;
};

const AnimationCard: FC<AnimationCardProps> = ({
  playback_id,
  appTitle,
  animationTitle,
  logoUrl,
  createdAt,
}) => {
  const url = `https://stream.mux.com/${playback_id}.m3u8`;
  const rotation = useMemo(() => getRandomRotation(), []);
  const viewMode = useAnimationsStore((state) => state.viewMode);

  // List mode - only show header
  if (viewMode === "list") {
    return (
      <View className="flex-row my-4 gap-3 items-center mx-1">
        <Image
          className="w-[45px] h-[45px] bg-white rounded-[10px] p-[1.5px]"
          style={{
            transform: [{ rotate: `0deg` }],
          }}
          source={{ uri: logoUrl }}
        />
        <View className="flex-1">
          <Text className="text-neutral-400 font-semibold">
            {appTitle}{" "}
            {isLessThanTenDays(createdAt) ? (
              <Text className="text-red-500 font-medium">new drop ✨</Text>
            ) : null}
          </Text>
          <Text numberOfLines={1} className="text-white text-lg font-semibold">
            {animationTitle}
          </Text>
        </View>
      </View>
    );
  }

  // Grid mode - show full card
  return (
    <View className="flex-1 mt-[40px]">
      <View className="flex-row mb-4 gap-3 items-center mx-1">
        <Image
          className="w-[45px] h-[45px] bg-white rounded-[10px] p-[1.5px]"
          style={{
            transform: [{ rotate: `${rotation}deg` }],
          }}
          source={{ uri: logoUrl }}
        />
        <View className="flex-1">
          <Text className="text-neutral-400 font-semibold">
            {appTitle}{" "}
            {isLessThanTenDays(createdAt) ? (
              <Text className="text-red-500 font-medium">new drop ✨</Text>
            ) : null}
          </Text>
          <Text numberOfLines={1} className="text-white text-lg font-semibold">
            {animationTitle}
          </Text>
        </View>
      </View>
      <View
        className="w-full aspect-square rounded-[32px] overflow-hidden"
        style={{ borderCurve: "continuous" }}
      >
        <Video source={{ uri: url }} style={{ width: "100%", height: "100%" }} />
      </View>
    </View>
  );
};

export default AnimationCard;
