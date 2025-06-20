import React, { FC } from "react";
import { View, Text } from "react-native";
import { GetNitroBtn } from "../components/get-nitro-btn";

type Props = {};

export const Account: FC<Props> = ({}) => {
  return (
    <View className="flex-1 bg-[#1C1D24] p-6 items-center justify-center">
      <GetNitroBtn />
    </View>
  );
};
