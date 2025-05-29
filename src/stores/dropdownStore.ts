import { create } from "zustand";

interface DropdownStoreProps {
  openDropdownId: string | null;
  toggleDropdownId: (id: string) => void;
}

export const useDropdownStore = create<DropdownStoreProps>((set, get) => ({
  openDropdownId: null,
  toggleDropdownId: (id) => {
    const { openDropdownId } = get();
    set({
      openDropdownId: openDropdownId === id ? null : id,
    });
  },
}));
