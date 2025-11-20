import { create } from "zustand";
import { SearchSlice, createSearchSlice } from "./search";
import { FiltersSlice, createFiltersSlice } from "./filters";

type AnimationsStore = SearchSlice & FiltersSlice;

export const useAnimationsStore = create<AnimationsStore>()((...a) => ({
  ...createSearchSlice(...a),
  ...createFiltersSlice(...a),
}));

export type { FilterType, SelectedFilters } from "./filters";
