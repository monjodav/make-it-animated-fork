export type HighlightValue = {
  value: string;
  matchLevel: string;
  matchedWords: string[];
};

export type AlgoliaHighlightResult = {
  app: {
    title: HighlightValue;
  };
  components: HighlightValue[];
  title: HighlightValue;
};

export type AppInfo = {
  _creationTime: number;
  _id: string;
  animation_ids: string[];
  icon_image_storage_id: string;
  icon_url: string;
  title: string;
};

export type VideoInfo = {
  dev: {
    asset_id: string;
    playback_id: string;
  };
  prod: {
    asset_id: string;
    playback_id: string;
  };
};

export type PostedInfo = {
  x: string | null;
  youtube: string | null;
};

export type HitItem = {
  _creationTime: number;
  _id: string;
  app: AppInfo;
  app_deeplink: string;
  app_id: string;
  components: string[];
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  posted: PostedInfo;
  priority: boolean;
  recommendedAnimationSlugs: string[];
  slug: string;
  technologies: string[];
  title: string;
  video: VideoInfo;
  objectID: string;
  _highlightResult: AlgoliaHighlightResult;
};

// Keep AnimationHit as alias for backward compatibility
export type AnimationHit = HitItem;

export type AlgoliaFacet = {
  name: string;
  data: Record<string, number>;
};

export type AlgoliaState = {
  disjunctiveFacets: string[];
  disjunctiveFacetsRefinements: Record<string, string[]>;
  facets: string[];
  facetsExcludes: Record<string, string[]>;
  facetsRefinements: Record<string, string[]>;
  hierarchicalFacets: any[];
  hierarchicalFacetsRefinements: Record<string, string[]>;
  highlightPostTag: string;
  highlightPreTag: string;
  index: string;
  numericRefinements: Record<string, any>;
  tagRefinements: string[];
};

export type AlgoliaRawResult = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  hits: AnimationHit[];
  hitsPerPage: number;
  index: string;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: {
    _request: {
      roundTrip: number;
    };
    total: number;
  };
  query: string;
  renderingContent: Record<string, any>;
  serverTimeMS: number;
};

export type AlgoliaSearchResults = {
  _rawResults: AlgoliaRawResult[];
  _state: AlgoliaState;
  disjunctiveFacets: AlgoliaFacet[];
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  facets: AlgoliaFacet[];
  hierarchicalFacets: any[];
  hits: AnimationHit[];
  hitsPerPage: number;
  index: string;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  persistHierarchicalRootCount: boolean;
  processingTimeMS: number;
  processingTimingsMS: {
    _request: {
      roundTrip: number;
    };
    total: number;
  };
  query: string;
  renderingContent: Record<string, any>;
  serverTimeMS: number;
};
