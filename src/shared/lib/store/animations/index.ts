import { create } from "zustand";
import { SearchSlice, createSearchSlice } from "./search";
import { FiltersSlice, createFiltersSlice } from "./filters";
import { BaseSlice, createBaseSlice } from "./base";

type AnimationsStore = SearchSlice & FiltersSlice & BaseSlice;

export const useAnimationsStore = create<AnimationsStore>()((...a) => ({
  ...createSearchSlice(...a),
  ...createFiltersSlice(...a),
  ...createBaseSlice(...a),
}));

export type { FilterType, SelectedFilters } from "./filters";
export type { ViewMode } from "./base";
export { filterData } from "./filters";
