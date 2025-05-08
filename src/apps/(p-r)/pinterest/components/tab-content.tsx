import React, { FC, useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTimer } from "react-timer-hook";
import { useFocusedTab } from "react-native-collapsible-tab-view";
import { Board } from "../lib/types";
import MasonryList from "./masonry-list";

// pinterest-pull-to-refresh-loading-animation 🔽

type Props = {
  board: Board;
};

export const TabContent: FC<Props> = ({ board }) => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const focusedTab = useFocusedTab();

  const expiryTimestamp = new Date(Date.now() + 1000);

  const { totalMilliseconds, start, pause, restart } = useTimer({
    expiryTimestamp,
  });

  // This is a hack to fetch the data only if the tab is in focus more than 1 second
  useEffect(() => {
    if (focusedTab === board.name) {
      start();
    }
    if (focusedTab !== board.name && data.length === 0) {
      restart(expiryTimestamp);
      pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab, board.name, data.length]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setData(board.pins);
    setLoading(false);
  }, [board.pins]);

  useEffect(() => {
    if (focusedTab === board.name && data.length === 0 && totalMilliseconds === 0) {
      fetchData();
    }
  }, [focusedTab, fetchData, board.name, data.length, totalMilliseconds]);

  if (loading || data.length === 0) {
    return (
      <View className="pt-[65px]">
        <ActivityIndicator />
      </View>
    );
  }

  return <MasonryList boardName={board.name} data={data} />;
};

// pinterest-pull-to-refresh-loading-animation 🔼
