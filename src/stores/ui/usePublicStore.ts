import { create } from "zustand";

interface PublicStoreState {
  publicChallengerModalOpen: boolean;
  setPublicChallengerModalOpen: (isOpen: boolean) => void;
}

const usePublicStore = create<PublicStoreState>((set) => ({
  publicChallengerModalOpen: false,
  setPublicChallengerModalOpen: (isOpen) =>
    set({ publicChallengerModalOpen: isOpen }),
}));

export default usePublicStore;
