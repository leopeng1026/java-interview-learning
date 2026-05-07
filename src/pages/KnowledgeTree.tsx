import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, BookOpen, Folder, Tag } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import type { KnowledgeNode } from '../types';

const typeIcons = {
  library: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
  domain: <Folder className="w-4 h-4 sm:w-5 sm:h-5" />,
  point: <Tag className="w-4 h-4 sm:w-5 sm:h-5" />,
};

const typeLabels = {
  library: '题库',
  domain: '领域',
  point: '知识点',
};

interface TreeNodeProps {
  node: KnowledgeNode;
  level: number;
}

function TreeNode({ node, level }: TreeNodeProps) {
  const { expandedNodes, toggleNode, selectNode, selectedNode } = useKnowledgeStore();
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNode?.id === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.05 }}
        className={`flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          toggleNode(node.id);
          selectNode(node);
        }}
      >
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )
          ) : (
            <div className="w-4 flex-shrink-0" />
          )}
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: node.color || '#1e3a5f' }}
          >
            {typeIcons[node.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm sm:text-base truncate">{node.name}</div>
            <div className="text-xs text-gray-500">
              {typeLabels[node.type]}
              {node.questionCount !== undefined && ` · ${node.questionCount}题`}
            </div>
          </div>
        </div>
        {node.masteryRate !== undefined && (
          <div className="hidden sm:flex items-center space-x-2 mr-4">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${node.masteryRate * 100}%`,
                  backgroundColor: node.color || '#1e3a5f',
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(node.masteryRate * 100)}%
            </span>
          </div>
        )}
        {node.masteryRate !== undefined && (
          <div className="sm:hidden flex items-center space-x-1 flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {Math.round(node.masteryRate * 100)}%
            </span>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KnowledgeTree() {
  const { tree, expandAll, collapseAll, selectedNode } = useKnowledgeStore();
  const [searchTerm, setSearchTerm] = useState('');

  const totalQuestions = tree.reduce(
    (sum, lib) =>
      sum +
      (lib.questionCount || 0) +
      (lib.children || []).reduce(
        (s, domain) =>
          s +
          (domain.questionCount || 0) +
          ((domain.children || []).reduce(
            (p, point) => p + (point.questionCount || 0),
            0
          )),
        0
      ),
    0
  );

  const avgMastery =
    tree.reduce((sum, lib) => sum + (lib.masteryRate || 0), 0) / tree.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            知识树
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            探索Java面试知识体系 · 共{totalQuestions}道题目
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={expandAll} className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            展开全部
          </button>
          <button onClick={collapseAll} className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            收起全部
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3 card p-3 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <input
              type="text"
              placeholder="搜索知识点..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            {tree.map((node) => (
              <TreeNode key={node.id} node={node} level={0} />
            ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {selectedNode ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 sm:p-6"
            >
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedNode.color || '#1e3a5f' }}
                >
                  {typeIcons[selectedNode.type]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {typeLabels[selectedNode.type]}
                  </p>
                </div>
              </div>
              {selectedNode.description && (
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  {selectedNode.description}
                </p>
              )}
              {selectedNode.masteryRate !== undefined && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-600">掌握度</span>
                    <span className="font-medium">
                      {Math.round(selectedNode.masteryRate * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${selectedNode.masteryRate * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              {selectedNode.type === 'point' && (
                <Link
                  to={`/practice/${selectedNode.id}`}
                  className="btn-primary w-full text-center block text-sm sm:text-base"
                >
                  开始练习
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="card p-4 sm:p-6 text-center text-gray-500">
              <div className="text-3xl sm:text-4xl mb-2">👈</div>
              <p className="text-xs sm:text-sm">选择一个知识点查看详情</p>
            </div>
          )}

          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">学习概览</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs sm:text-sm">平均掌握度</span>
                <span className="font-bold text-primary text-sm sm:text-base">
                  {Math.round(avgMastery * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs sm:text-sm">题库总数</span>
                <span className="font-bold text-accent text-sm sm:text-base">{tree.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs sm:text-sm">题目总数</span>
                <span className="font-bold text-green-500 text-sm sm:text-base">
                  {totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
