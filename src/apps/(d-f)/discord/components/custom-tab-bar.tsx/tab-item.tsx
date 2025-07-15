import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import Reanimated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// discord-top-tabs-indicator-animation 🔽

// Discord brand colors for tab text states
const TEXT_ACTIVE_COLOR = "#F9F9FA"; // Near-white for active tab prominence
const TEXT_INACTIVE_COLOR = "#868997"; // Muted gray reduces visual noise from inactive tabs

type Props = {
  index: number; // Static tab position (0, 1, 2...) for interpolation calculations
  tabName: string;
  indexDecimal: SharedValue<number>; // Shared animated index drives color transitions
  onPress: () => void;
};

export const TabItem: FC<Props> = ({ index, tabName, indexDecimal, onPress }) => {
  // Animated text color transitions - smoothly fades between active/inactive states
  const rTextStyle = useAnimatedStyle(() => {
    // Three-point interpolation: inactive -> active -> inactive as indexDecimal passes through
    // Range [index-1, index, index+1] ensures smooth transitions between adjacent tabs
    const color = interpolateColor(
      indexDecimal.value,
      [index - 1, index, index + 1], // Input range centered on this tab's index
      [TEXT_INACTIVE_COLOR, TEXT_ACTIVE_COLOR, TEXT_INACTIVE_COLOR] // Color progression
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9} // Subtle press feedback without competing with color animations
      onPress={onPress}
      className="flex-1 items-center justify-center h-full" // Equal width distribution across all tabs
    >
      {/* Animated text inherits smooth color transitions from interpolateColor */}
      <Reanimated.Text className="text-base font-semibold" style={rTextStyle}>
        {tabName}
      </Reanimated.Text>
    </TouchableOpacity>
  );
};

// discord-top-tabs-indicator-animation 🔼
