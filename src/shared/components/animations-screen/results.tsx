import React, { FC, useEffect } from "react";
import { useHits } from "react-instantsearch-core";
import { View, Text } from "react-native";
import Video from "react-native-video";

type Props = {};

export const Results: FC<Props> = ({}) => {
  const { results } = useHits();

  const firstItem = results?.hits[0];

  const playbackId = firstItem?.video?.dev?.playback_id;
  const url = `https://stream.mux.com/${playbackId}.m3u8`;

  return (
    <View className="flex-1 items-center justify-center">
      <View
        className="w-[300px] aspect-square rounded-[32px] overflow-hidden"
        style={{ borderCurve: "continuous" }}
      >
        <Video source={{ uri: url }} style={{ width: "100%", height: "100%" }} />
      </View>
    </View>
  );
};
