import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KnowledgeNode } from '../types';
import { initialKnowledgeTree } from '../data/initialData';

interface KnowledgeState {
  tree: KnowledgeNode[];
  expandedNodes: Set<number>;
  selectedNode: KnowledgeNode | null;

  toggleNode: (nodeId: number) => void;
  expandNode: (nodeId: number) => void;
  collapseNode: (nodeId: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  selectNode: (node: KnowledgeNode | null) => void;
  getNodePath: (nodeId: number) => KnowledgeNode[];
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      tree: initialKnowledgeTree,
      expandedNodes: new Set([1, 2, 3]),
      selectedNode: null,

      toggleNode: (nodeId) => {
        const { expandedNodes } = get();
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
          newExpanded.delete(nodeId);
        } else {
          newExpanded.add(nodeId);
        }
        set({ expandedNodes: newExpanded });
      },

      expandNode: (nodeId) => {
        const { expandedNodes } = get();
        const newExpanded = new Set(expandedNodes);
        newExpanded.add(nodeId);
        set({ expandedNodes: newExpanded });
      },

      collapseNode: (nodeId) => {
        const { expandedNodes } = get();
        const newExpanded = new Set(expandedNodes);
        newExpanded.delete(nodeId);
        set({ expandedNodes: newExpanded });
      },

      expandAll: () => {
        const collectAllIds = (nodes: KnowledgeNode[]): number[] => {
          return nodes.flatMap(node => [
            node.id,
            ...(node.children ? collectAllIds(node.children) : []),
          ]);
        };
        const allIds = collectAllIds(get().tree);
        set({ expandedNodes: new Set(allIds) });
      },

      collapseAll: () => {
        set({ expandedNodes: new Set() });
      },

      selectNode: (node) => {
        set({ selectedNode: node });
      },

      getNodePath: (nodeId) => {
        const findPath = (
          nodes: KnowledgeNode[],
          targetId: number,
          path: KnowledgeNode[] = []
        ): KnowledgeNode[] | null => {
          for (const node of nodes) {
            const newPath = [...path, node];
            if (node.id === targetId) {
              return newPath;
            }
            if (node.children) {
              const found = findPath(node.children, targetId, newPath);
              if (found) return found;
            }
          }
          return null;
        };
        return findPath(get().tree, nodeId) || [];
      },
    }),
    {
      name: 'knowledge-storage',
      partialize: (state) => ({
        expandedNodes: Array.from(state.expandedNodes),
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        expandedNodes: new Set(persistedState?.expandedNodes || []),
      }),
    }
  )
);
