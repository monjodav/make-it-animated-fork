import { FC } from "react";
import { Text, View } from "react-native";

type MonthDatesItemProps = {
  screenWidth: number;
  weeks: Array<Array<Date | null>>;
  dateCellSize: number;
};

const MonthDatesItem: FC<MonthDatesItemProps> = ({ screenWidth, weeks, dateCellSize }) => {
  return (
    <View style={{ width: screenWidth }} className="px-4">
      {weeks.map((week, wIdx) => (
        <View key={wIdx} className="flex-row justify-between mb-1">
          {week.map((date, dIdx) => (
            <View
              key={dIdx}
              className="items-center justify-center"
              style={{ width: dateCellSize, height: dateCellSize }}
            >
              {date ? (
                <Text className="text-white text-lg font-semibold text-center">
                  {date.getDate()}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default MonthDatesItem;
