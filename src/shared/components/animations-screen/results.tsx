import { FC } from "react";
import { useHits } from "react-instantsearch-core";
import AnimationCard from "./animation-card";
import { LegendList } from "@legendapp/list";
import { AlgoliaRawResult, AnimationHit } from "../../lib/types/algolia-search";

export const Results: FC = () => {
  const { results } = useHits<AlgoliaRawResult>();
  const hits = results?.hits as AnimationHit[] | undefined;
  // console.log(">>", JSON.stringify(results, null, 2));
  return (
    <LegendList
      data={hits ?? []}
      renderItem={({ item }) => (
        <AnimationCard
          playback_id={item.video.dev.playback_id}
          appTitle={item.app.title}
          animationTitle={item.title}
          logoUrl={item.app.icon_url}
          createdAt={item._creationTime}
        />
      )}
      keyExtractor={(item) => item._id}
      recycleItems
      maintainVisibleContentPosition
    />
  );
};
