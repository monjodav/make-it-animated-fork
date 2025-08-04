import { FC, useEffect, useState } from "react";
import { Pressable, TextLayoutLine, Text, StyleSheet } from "react-native";
import { postDescriptionClassNames } from "../../lib/constants/post-description";
import { TextLine } from "./text-line";
import { cn } from "@/src/shared/lib/utils/cn";

// instagram-post-truncated-text-animation 🔽

type Props = {
  text: string;
  numberOfLines: number; // Maximum lines to show in truncated state
};

export const Description: FC<Props> = ({ text, numberOfLines }: Props) => {
  // TextLayoutLine array contains precise text measurement data for each line
  // Enables accurate truncation without guessing character counts
  const [lines, setLines] = useState<TextLayoutLine[]>([]);

  // Controls expand/collapse state - starts truncated for Instagram-style UX
  const [isTruncated, setIsTruncated] = useState<boolean>(true);

  useEffect(() => {
    // Reset layout measurements when text prop changes
    // Forces onTextLayout to recalculate line breaks for new content
    if (lines.length > 0) {
      setLines([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    // Entire description area is pressable for Instagram-style expand/collapse
    <Pressable onPress={() => setIsTruncated(!isTruncated)}>
      {/* Hidden measurement text - gets precise line break data without visual impact */}
      <Text
        style={StyleSheet.absoluteFill} // Overlays exactly on top of visible text
        className={cn(postDescriptionClassNames.text, "opacity-0 pointer-events-none")}
        onTextLayout={(e) => {
          // Only measure once to prevent infinite re-renders
          if (lines.length === 0) {
            setLines(e.nativeEvent.lines); // Each line contains text, width, height, x, y
          }
        }}
      >
        {text}
      </Text>

      {/* Render visible text lines based on truncation state */}
      {lines &&
        lines
          .slice(0, isTruncated ? numberOfLines : lines.length) // Show limited lines when truncated
          .map((line, index) => (
            <TextLine
              key={index}
              index={index}
              line={line} // Contains precise text measurement data
              totalLines={lines.length}
              numberOfLines={numberOfLines}
              isTruncated={isTruncated}
            />
          ))}
    </Pressable>
  );
};

// instagram-post-truncated-text-animation 🔼
