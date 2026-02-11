import { create } from "zustand";

type DashboardStoreProps = {
  activeTab: "current" | "past";
  setActiveTab: (tab: "current" | "past") => void;
};

export const useDashboardStore = create<DashboardStoreProps>((set) => ({
  activeTab: "current",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
