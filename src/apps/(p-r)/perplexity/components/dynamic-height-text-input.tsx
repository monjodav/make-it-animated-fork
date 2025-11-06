import { cn } from "@/src/shared/lib/utils/cn";
import { FC, useEffect, useState } from "react";
import { TextInput, Text, TextInputProps, Platform } from "react-native";

type DynamicHeightTextInputProps = TextInputProps & {
  maxNumberOfLines?: number;
};

const DynamicHeightTextInput: FC<DynamicHeightTextInputProps> = ({
  className,
  maxNumberOfLines = 5,
  ...restProps
}) => {
  const [text, setText] = useState("");
  const [textHeight, setTextHeight] = useState(20);

  const lineHeight = textHeight * 1.1;
  const maxHeight = lineHeight * maxNumberOfLines;

  const [inputHeight, setInputHeight] = useState(lineHeight);

  const handleTextChange = (newText: string) => {
    setText(newText);

    // Calculate height based on lines
    const lines = newText.split("\n");
    const lineCount = Math.max(1, lines.length);
    const newInputHeight = lineCount * lineHeight;
    setInputHeight(newInputHeight);
  };

  useEffect(() => {
    setInputHeight(lineHeight);
  }, [textHeight]);

  return (
    <>
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        placeholder="Ask anything..."
        placeholderTextColor="#737373"
        multiline
        className={cn(className, "text-neutral-50 font-medium")}
        selectionColor="#ffffff"
        textAlignVertical="top"
        style={{
          lineHeight: lineHeight,
          height: Math.min(inputHeight + 10, maxHeight),
          maxHeight: maxHeight,
          ...(Platform.OS === "android" && {
            marginTop: 4,
          }),
        }}
        {...restProps}
      />
      <Text
        onTextLayout={(e) => {
          setTextHeight(e.nativeEvent.lines[0].height);
        }}
        className={cn(className, "absolute opacity-0 pointer-events-none")}
      ></Text>
    </>
  );
};

export default DynamicHeightTextInput;
