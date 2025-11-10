import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC, useEffect, useState } from "react";
import { TextInput, Text, TextInputProps, Platform, View } from "react-native";

type DynamicHeightTextInputProps = TextInputProps & {
  ref: React.RefObject<TextInput | null>;
  maxNumberOfLines?: number;
};

export const DynamicHeightTextInput: FC<DynamicHeightTextInputProps> = ({
  ref,
  className,
  maxNumberOfLines = 5,
  ...restProps
}) => {
  const [text, setText] = useState("");
  const [textHeight, setTextHeight] = useState(0);
  const [lines, setLines] = useState(1);

  const maxHeight = textHeight * (maxNumberOfLines + (Platform.OS === "android" ? 1 : 0));

  const [inputHeight, setInputHeight] = useState(textHeight);

  const handleTextChange = (newText: string) => {
    setText(newText);
    // Calculate height based on lines
    // const lines = newText.split("\n");
    // const lineCount = Math.max(1, lines.length);
    // const newInputHeight = lineCount * textHeight;
    // setInputHeight(newInputHeight);
  };

  useEffect(() => {
    setInputHeight(textHeight * lines);
  }, [textHeight, lines]);

  return (
    <View>
      <TextInput
        ref={ref}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Ask anything..."
        placeholderTextColor="#737373"
        multiline
        className={cn(className, "text-neutral-50")}
        selectionColor="#ffffff"
        style={[
          {
            height: Math.min(inputHeight + (Platform.OS === "android" ? 20 : 5), maxHeight),
            maxHeight: maxHeight,
          },
        ]}
        {...restProps}
      />
      <Text
        onTextLayout={(e) => {
          if (textHeight === 0) {
            setTextHeight(e.nativeEvent.lines[0].height);
          }
          setLines(e.nativeEvent.lines.length);
        }}
        className={cn(className, "absolute bottom-0 opacity-50 pointer-events-none")}
      >
        {text}
      </Text>
    </View>
  );
};
