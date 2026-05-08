import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BookOpen, Target, Zap, RotateCcw, Loader2 } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { KnowledgeNode } from '../types';
import { useProgressStore } from '../store/progressStore';

interface PracticeSelectorProps {
  onSelect: (knowledgePointId: number) => void;
}

export default function PracticeSelector({ onSelect }: PracticeSelectorProps) {
  const { tree, isLoading, error, fetchKnowledgeTree } = useKnowledgeStore();
  const { progress } = useProgressStore();
  const [expandedLibraries, setExpandedLibraries] = useState<number[]>([]);
  const [expandedDomains, setExpandedDomains] = useState<number[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [practiceMode, setPracticeMode] = useState<'normal' | 'random' | 'review'>('normal');

  useEffect(() => {
    fetchKnowledgeTree();
  }, [fetchKnowledgeTree]);

  useEffect(() => {
    if (tree.length > 0 && expandedLibraries.length === 0) {
      const libraryIds = tree.map(node => node.id);
      setExpandedLibraries(libraryIds);
    }
  }, [tree, expandedLibraries.length]);

  const toggleLibrary = (id: number) => {
    setExpandedLibraries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleDomain = (id: number) => {
    setExpandedDomains(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getMasteryRate = (pointId: number) => {
    const kp = progress.knowledgePoints[pointId];
    return kp ? Math.round(kp.mastery * 100) : 0;
  };

  const getPracticeCount = (pointId: number) => {
    const kp = progress.knowledgePoints[pointId];
    return kp ? kp.totalAnswered : 0;
  };

  const modeOptions = [
    { value: 'normal', label: '顺序练习', icon: BookOpen, desc: '按顺序练习所有题目' },
    { value: 'random', label: '随机练习', icon: Zap, desc: '随机抽取题目练习' },
    { value: 'review', label: '错题复习', icon: RotateCcw, desc: '复习做错的题目' },
  ] as const;

  const renderKnowledgeTree = (nodes: KnowledgeNode[], level: number = 0) => {
    if (level === 0) {
      return nodes.map((library) => (
        <div key={library.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLibrary(library.id)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: library.color || '#666' }}
              />
              <span className="font-medium text-gray-800">{library.name}</span>
              <span className="text-xs text-gray-500">({library.questionCount}题)</span>
            </div>
            {expandedLibraries.includes(library.id) ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedLibraries.includes(library.id) && library.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200"
              >
                {library.children.map((domain) => (
                  <div key={domain.id}>
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors pl-6"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{domain.name}</span>
                        <span className="text-xs text-gray-400">({domain.questionCount}题)</span>
                      </div>
                      {expandedDomains.includes(domain.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedDomains.includes(domain.id) && domain.children && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {domain.children.map((point) => (
                            <button
                              key={point.id}
                              onClick={() => setSelectedPoint(point.id)}
                              className={`w-full flex items-center justify-between p-3 pl-10 transition-colors ${
                                selectedPoint === point.id
                                  ? 'bg-primary/5 border-l-2 border-primary'
                                  : 'bg-white hover:bg-gray-50 border-l-2 border-transparent'
                              }`}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium text-gray-800 text-sm">
                                  {point.name}
                                </div>
                                {point.description && (
                                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                    {point.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-3 ml-4">
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">掌握度</div>
                                  <div className="text-sm font-medium text-gray-700">
                                    {getMasteryRate(point.id)}%
                                  </div>
                                </div>
                                <div className="w-12">
                                  <div className="text-xs text-gray-500 text-center">已练</div>
                                  <div className="text-sm font-medium text-gray-700 text-center">
                                    {getPracticeCount(point.id)}/{point.questionCount}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ));
    }
    return null;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4 sm:p-6 flex items-center justify-center h-64"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-500">加载知识树...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4 sm:p-6"
      >
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={() => fetchKnowledgeTree()}
            className="mt-2 text-sm text-primary hover:underline"
          >
            点击重试
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-serif font-semibold flex items-center space-x-2">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span>选择练习内容</span>
        </h2>
      </div>

      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">练习模式</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {modeOptions.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.value}
                onClick={() => setPracticeMode(mode.value)}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${
                  practiceMode === mode.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={`w-4 h-4 ${practiceMode === mode.value ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`font-medium text-xs sm:text-sm ${practiceMode === mode.value ? 'text-primary' : 'text-gray-700'}`}>
                    {mode.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">知识点选择</h3>
        <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto pr-2">
          {renderKnowledgeTree(tree)}
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => {
            if (selectedPoint) {
              onSelect(selectedPoint);
            }
          }}
          disabled={!selectedPoint}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookOpen className="w-4 h-4" />
          <span>开始练习</span>
        </button>
        {practiceMode === 'review' && (
          <button
            onClick={() => onSelect(0)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>复习全部</span>
          </button>
        )}
      </div>

      {!selectedPoint && practiceMode !== 'review' && (
        <p className="text-center text-sm text-gray-500 mt-4">
          请选择一个知识点开始练习
        </p>
      )}
    </motion.div>
  );
}
