import React, { FC } from "react";
import { View, ScrollView } from "react-native";
import Carousel from "../components/carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Blocks: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerClassName="px-5"
      contentContainerStyle={{ paddingTop: insets.top + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-2 w-1/3 h-5 rounded-full bg-neutral-900" />
      <View className="mb-4 w-2/3 h-5 rounded-full bg-neutral-900" />
      <View className="-mx-5 mb-10">
        {/* opal-horizontal-carousel-animation 🔽 */}
        <Carousel
          data={[
            "L87Luf_JHtDk%yx@eUaOH[WByCx[",
            "LOH]%h^N9^Iq}ts.oLaz=eR*ofxZ",
            "LEA]]RrW0}Os%KM{WBxu11Ip|=xZ",
            "LJOXU1-pxuoz~XIoRjWBxsNHfOoJ",
          ]}
        />
        {/* opal-horizontal-carousel-animation 🔼 */}
      </View>
      <View className="mb-2 w-1/2 h-5 rounded-full bg-neutral-900" />
      <View className="mb-4 w-[40%] h-5 rounded-full bg-neutral-900" />
      <View className="-mx-5 mb-10">
        <Carousel
          data={[
            "LKO2:N%2Tw=w]~RBVZRi};RPxuwH",
            "L60MZWh2e7f,k]f5f5e.hyfmf5e-",
            "LEHLh[WB2yk8pyoJadR*.7kCMdnj",
            "LKN]Rv%2Tw=w]~RBVZRi};RPxuwH",
            "LWD-8itmofRPKnWCV?kXM}RjkCoz",
            "L25Xx[rV00%#Mw%M%2Mw00x]~qMd",
          ]}
        />
      </View>
    </ScrollView>
  );
};
