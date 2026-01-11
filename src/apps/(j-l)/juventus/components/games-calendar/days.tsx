import { Text, View } from "react-native";
import { DATE_CELL_SIZE } from "../../lib/constants";
import { getMonthWeeks } from "../../lib/utils";

type DaysProps = {
  data: { label: string; date: Date };
};

export const Days = ({ data }: DaysProps) => {
  const weeks = getMonthWeeks(data);

  return (
    <View className="w-full px-4">
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row justify-between mb-1">
          {week.map((date, dayIndex) => {
            return (
              <View
                key={dayIndex}
                className="items-center justify-center"
                style={{ width: DATE_CELL_SIZE, height: DATE_CELL_SIZE }}
              >
                <Text className="text-white text-lg font-semibold text-center">
                  {date ? date.getDate() : ""}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
