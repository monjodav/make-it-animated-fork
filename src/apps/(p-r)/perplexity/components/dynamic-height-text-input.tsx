import { cn } from "@/src/shared/lib/utils/cn";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TextInput, Text, TextInputProps, Platform } from "react-native";

type DynamicHeightTextInputProps = TextInputProps & {
  maxNumberOfLines?: number;
};

const DynamicHeightTextInput = forwardRef<TextInput, DynamicHeightTextInputProps>(
  ({ className, maxNumberOfLines = 5, ...restProps }, ref) => {
    const [text, setText] = useState("");
    const [textHeight, setTextHeight] = useState(20);

    const lineHeight = textHeight * 1.1;
    const maxHeight = lineHeight * (maxNumberOfLines + (Platform.OS === "android" ? 1 : 0));

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

    const innerRef = useRef<TextInput>(null);

    useImperativeHandle(
      ref,
      () =>
        ({
          focus: () => innerRef.current?.focus(),
          blur: () => innerRef.current?.blur(),
          clear: () => innerRef.current?.clear(),
          isFocused: () => innerRef.current?.isFocused?.() ?? false,
          setNativeProps: (props: any) => innerRef.current?.setNativeProps(props),
        }) as any
    );

    return (
      <>
        <TextInput
          ref={innerRef}
          value={text}
          onChangeText={handleTextChange}
          placeholder="Ask anything..."
          placeholderTextColor="#737373"
          multiline
          className={cn(className, "text-neutral-50 font-medium")}
          selectionColor="#ffffff"
          style={{
            lineHeight: lineHeight,
            height: Math.min(inputHeight + (Platform.OS === "android" ? 20 : 5), maxHeight),
            maxHeight: maxHeight,
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
  }
);

export default DynamicHeightTextInput;
