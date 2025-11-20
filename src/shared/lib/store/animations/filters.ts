import { StateCreator } from "zustand";

export type FilterType = "apps" | "technologies" | "components" | "difficulty";
export type SelectedFilters = Record<FilterType, string[]>;

export type FiltersSlice = {
  currentFilter: FilterType;
  selectedFilters: SelectedFilters;
  setCurrentFilter: (type: FilterType) => void;
  toggleItem: (item: string) => void;
  removeItem: (type: FilterType, item: string) => void;
  clearAll: () => void;
};

const initialSelectedFilters: SelectedFilters = {
  apps: [],
  technologies: [],
  components: [],
  difficulty: [],
};

export const createFiltersSlice: StateCreator<FiltersSlice> = (set, get) => ({
  currentFilter: "apps",
  selectedFilters: initialSelectedFilters,

  setCurrentFilter: (type) => set({ currentFilter: type }),

  toggleItem: (item) => {
    const { currentFilter, selectedFilters } = get();
    const currentItems = selectedFilters[currentFilter];
    const isSelected = currentItems.includes(item);

    set({
      selectedFilters: {
        ...selectedFilters,
        [currentFilter]: isSelected
          ? currentItems.filter((i) => i !== item)
          : [...currentItems, item],
      },
    });
  },

  removeItem: (type, item) => {
    const { selectedFilters } = get();
    set({
      selectedFilters: {
        ...selectedFilters,
        [type]: selectedFilters[type].filter((i) => i !== item),
      },
    });
  },

  clearAll: () => set({ selectedFilters: initialSelectedFilters }),
});
