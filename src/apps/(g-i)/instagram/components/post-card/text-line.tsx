import React, { FC } from "react";
import { Text, TextLayoutLine, View } from "react-native";
import { postDescriptionClassNames } from "../../lib/constants/post-description";

type Props = {
  index: number;
  line: TextLayoutLine;
  totalLines: number;
  numberOfLines: number;
  isTruncated: boolean;
};

export const TextLine: FC<Props> = ({ index, line, totalLines, numberOfLines, isTruncated }) => {
  if (isTruncated && numberOfLines < totalLines && index === numberOfLines - 1) {
    const string = line.text.trim();

    return (
      <View key={index} className="self-start flex-row items-center">
        {string.length > 0 && (
          <Text className={postDescriptionClassNames.text}>
            {string.length > 30 ? string.slice(0, string.length - 10) : string}
          </Text>
        )}
        <Text className={postDescriptionClassNames.text}>
          {string ? "... " : ""}
          <Text className="text-neutral-400">more</Text>
        </Text>
      </View>
    );
  }

  return <Text className={postDescriptionClassNames.text}>{line.text.trim()}</Text>;
};
