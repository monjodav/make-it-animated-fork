export type ProductItem = {
  id: string;
  imageUrl: string;
};

export const data = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1710504989595-604f59d1b140?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGFkaWRhc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1505874462322-dfcf87f819a9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFkaWRhc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1695552835054-95b185af3d11?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGFkaWRhc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1618545647089-da834ede280c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzA5fHxhZGlkYXN8ZW58MHx8MHx8fDI%3D",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGFkaWRhc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1651013691313-81b822df0044?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHxhZGlkYXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "7",
    imageUrl:
      "https://images.unsplash.com/photo-1659785568847-2c9581fe7d98?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQxfHxhZGlkYXN8ZW58MHx8MHx8fDA%3D",
  },
];

export const addIndexToData = <T extends Record<string, any>>(
  data: T[]
): (T & { index: number })[] => {
  return data.map((item, index) => ({ ...item, index }));
};

export const INITIAL_DATA: (ProductItem & { index: number })[] = addIndexToData(data);

export const generateNewItems = () => {
  return INITIAL_DATA.map((item) => ({
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${Math.random().toString(36).substring(2, 9)}`,
  }));
};
