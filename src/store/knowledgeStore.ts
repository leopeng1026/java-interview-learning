import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KnowledgeNode } from '../types';
import { initialKnowledgeTree } from '../data/initialData';
import apiService, { KnowledgeNode as ApiKnowledgeNode } from '../services/api';

interface KnowledgeState {
  tree: KnowledgeNode[];
  expandedNodes: Set<number>;
  selectedNode: KnowledgeNode | null;
  isLoading: boolean;
  error: string | null;
  useBackend: boolean;

  fetchKnowledgeTree: () => Promise<void>;
  toggleNode: (nodeId: number) => void;
  expandNode: (nodeId: number) => void;
  collapseNode: (nodeId: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  selectNode: (node: KnowledgeNode | null) => void;
  getNodePath: (nodeId: number) => KnowledgeNode[];
  setUseBackend: (useBackend: boolean) => void;
}

const convertApiNode = (apiNode: ApiKnowledgeNode): KnowledgeNode => {
  return {
    id: apiNode.id,
    name: apiNode.name,
    type: apiNode.type,
    description: apiNode.description,
    color: apiNode.color,
    questionCount: apiNode.questionCount,
    masteryRate: apiNode.masteryRate,
    parentId: apiNode.parentId,
    children: apiNode.children?.map(convertApiNode),
  };
};

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      tree: initialKnowledgeTree,
      expandedNodes: new Set([1, 2, 3]),
      selectedNode: null,
      isLoading: false,
      error: null,
      useBackend: true,

      fetchKnowledgeTree: async () => {
        const { useBackend } = get();
        if (!useBackend) {
          set({ tree: initialKnowledgeTree });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const apiTree = await apiService.getKnowledgeTree();
          const tree = apiTree.map(convertApiNode);
          set({ tree, isLoading: false });

          const allIds = new Set<number>();
          const collectIds = (nodes: KnowledgeNode[]) => {
            nodes.forEach(node => {
              if (node.type === 'library') {
                allIds.add(node.id);
              }
              if (node.children) {
                collectIds(node.children);
              }
            });
          };
          collectIds(tree);
          set({ expandedNodes: allIds });
        } catch (error) {
          console.error('Failed to fetch knowledge tree:', error);
          set({
            error: 'Failed to fetch knowledge tree, using local data',
            tree: initialKnowledgeTree,
            isLoading: false
          });
        }
      },

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
        const { tree } = get();
        const libraryIds = tree
          .filter(node => node.type === 'library')
          .map(node => node.id);
        set({ expandedNodes: new Set(libraryIds) });
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

      setUseBackend: (useBackend: boolean) => {
        set({ useBackend });
        if (useBackend) {
          get().fetchKnowledgeTree();
        } else {
          set({ tree: initialKnowledgeTree });
        }
      },
    }),
    {
      name: 'knowledge-storage',
      partialize: (state) => ({
        expandedNodes: Array.from(state.expandedNodes),
        useBackend: state.useBackend,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        expandedNodes: new Set(persistedState?.expandedNodes || []),
        useBackend: persistedState?.useBackend ?? true,
      }),
    }
  )
);
