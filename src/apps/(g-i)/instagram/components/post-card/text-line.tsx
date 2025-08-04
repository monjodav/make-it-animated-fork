import React, { FC } from "react";
import { Text, TextLayoutLine, View } from "react-native";
import { postDescriptionClassNames } from "../../lib/constants/post-description";

// instagram-post-truncated-text-animation 🔽

type Props = {
  index: number; // Zero-based line index for rendering order
  line: TextLayoutLine; // Contains text, width, height, x, y measurements
  totalLines: number; // Total lines in full text (for truncation logic)
  numberOfLines: number; // Maximum lines to show when truncated
  isTruncated: boolean; // Current expand/collapse state
};

export const TextLine: FC<Props> = ({ index, line, totalLines, numberOfLines, isTruncated }) => {
  // Special handling for the last visible line in truncated state
  // Only applies when: text is truncated AND there are more lines AND this is the last visible line
  if (isTruncated && numberOfLines < totalLines && index === numberOfLines - 1) {
    const string = line.text.trim();

    return (
      <View key={index} className="self-start flex-row items-center">
        {string.length > 0 && (
          <Text className={postDescriptionClassNames.text}>
            {/* Smart truncation: remove 10 chars if line is long (>30), otherwise show full line */}
            {string.length > 30 ? string.slice(0, string.length - 10) : string}
          </Text>
        )}
        <Text className={postDescriptionClassNames.text}>
          {/* Conditional ellipsis: only show "..." if there's actual text content */}
          {string ? "... " : ""}
          {/* Instagram-style "more" link with muted color */}
          <Text className="text-neutral-400">more</Text>
        </Text>
      </View>
    );
  }

  // Standard line rendering for non-truncated lines
  // Uses precise TextLayoutLine.text to maintain exact line breaks
  return <Text className={postDescriptionClassNames.text}>{line.text.trim()}</Text>;
};

// instagram-post-truncated-text-animation 🔼
