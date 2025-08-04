import { FC, useEffect, useState } from "react";
import { Pressable, TextLayoutLine, Text, StyleSheet } from "react-native";
import { postDescriptionClassNames } from "../../lib/constants/post-description";
import { TextLine } from "./text-line";
import { cn } from "@/src/shared/lib/utils/cn";

type Props = {
  text: string;
  numberOfLines: number;
};

export const Description: FC<Props> = ({ text, numberOfLines }: Props) => {
  const [lines, setLines] = useState<TextLayoutLine[]>([]);
  const [isTruncated, setIsTruncated] = useState<boolean>(true);

  useEffect(() => {
    // we re-calculating here on text change
    if (lines.length > 0) {
      setLines([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Pressable onPress={() => setIsTruncated(!isTruncated)}>
      <Text
        style={StyleSheet.absoluteFill}
        className={cn(postDescriptionClassNames.text, "opacity-0 pointer-events-none")}
        onTextLayout={(e) => {
          if (lines.length === 0) {
            setLines(e.nativeEvent.lines);
          }
        }}
      >
        {text}
      </Text>
      {lines &&
        lines
          .slice(0, isTruncated ? numberOfLines : lines.length)
          .map((line, index) => (
            <TextLine
              key={index}
              index={index}
              line={line}
              totalLines={lines.length}
              numberOfLines={numberOfLines}
              isTruncated={isTruncated}
            />
          ))}
    </Pressable>
  );
};
