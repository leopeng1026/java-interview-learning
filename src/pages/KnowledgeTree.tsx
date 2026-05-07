import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, BookOpen, Folder, Tag } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import type { KnowledgeNode } from '../types';

const typeIcons = {
  library: <BookOpen className="w-5 h-5" />,
  domain: <Folder className="w-5 h-5" />,
  point: <Tag className="w-5 h-5" />,
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
        className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => {
          toggleNode(node.id);
          selectNode(node);
        }}
      >
        <div className="flex items-center space-x-3 flex-1">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )
          ) : (
            <div className="w-4" />
          )}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: node.color || '#1e3a5f' }}
          >
            {typeIcons[node.type]}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{node.name}</div>
            <div className="text-xs text-gray-500">
              {typeLabels[node.type]}
              {node.questionCount !== undefined && ` · ${node.questionCount}题`}
            </div>
          </div>
        </div>
        {node.masteryRate !== undefined && (
          <div className="flex items-center space-x-2 mr-4">
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            知识树
          </h1>
          <p className="text-gray-500 mt-1">
            探索Java面试知识体系 · 共{totalQuestions}道题目
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={expandAll} className="btn-secondary text-sm">
            展开全部
          </button>
          <button onClick={collapseAll} className="btn-secondary text-sm">
            收起全部
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索知识点..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            {tree.map((node) => (
              <TreeNode key={node.id} node={node} level={0} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {selectedNode ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedNode.color || '#1e3a5f' }}
                >
                  {typeIcons[selectedNode.type]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedNode.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {typeLabels[selectedNode.type]}
                  </p>
                </div>
              </div>
              {selectedNode.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {selectedNode.description}
                </p>
              )}
              {selectedNode.masteryRate !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
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
                  className="btn-primary w-full text-center block"
                >
                  开始练习
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="card p-6 text-center text-gray-500">
              <div className="text-4xl mb-2">👈</div>
              <p>选择一个知识点查看详情</p>
            </div>
          )}

          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-4">学习概览</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">平均掌握度</span>
                <span className="font-bold text-primary">
                  {Math.round(avgMastery * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">题库总数</span>
                <span className="font-bold text-accent">{tree.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">题目总数</span>
                <span className="font-bold text-green-500">
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
