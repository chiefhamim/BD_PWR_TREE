import { create } from 'zustand';

interface GridState {
  selectedNodeId: string | null;
  isDetailsOpen: boolean;
  setSelectedNode: (nodeId: string | null) => void;
  setDetailsOpen: (isOpen: boolean) => void;
}

export const useGridStore = create<GridState>((set) => ({
  selectedNodeId: null,
  isDetailsOpen: false,
  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setDetailsOpen: (isOpen) => set({ isDetailsOpen: isOpen }),
}));
