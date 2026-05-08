import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react';
import QuestionForm from '../components/QuestionForm';
import apiService, { Question } from '../services/api';
import toast from 'react-hot-toast';
import { useKnowledgeStore } from '../store/knowledgeStore';

export default function QuestionBank() {
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const { tree, fetchKnowledgeTree } = useKnowledgeStore();

  useEffect(() => {
    fetchKnowledgeTree();
    loadQuestions();
  }, [fetchKnowledgeTree]);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, filterDifficulty, questions]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error('加载题目失败');
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDifficulty) {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  const getKnowledgePointName = (pointId: number): string => {
    const findPoint = (nodes: any[]): string | null => {
      for (const node of nodes) {
        if (node.id === pointId) return node.name;
        if (node.children) {
          const found = findPoint(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findPoint(tree) || `知识点 #${pointId}`;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这道题目吗？')) return;

    try {
      await apiService.deleteQuestion(id);
      toast.success('删除成功');
      loadQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('删除失败');
    }
  };

  const handleQuestionCreated = () => {
    setShowForm(false);
    loadQuestions();
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      easy: { label: '简单', className: 'bg-green-100 text-green-700' },
      medium: { label: '中等', className: 'bg-yellow-100 text-yellow-700' },
      hard: { label: '困难', className: 'bg-red-100 text-red-700' },
    };
    const badge = badges[difficulty as keyof typeof badges] || badges.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        {type === 'single_choice' ? '单选题' : '多选题'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-500">加载题库...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
          题库管理
        </h1>
        <p className="text-gray-600">管理和录入面试题目</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索题目内容或标签..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">全部难度</option>
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>录入题目</span>
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        共 {filteredQuestions.length} 道题目
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">暂无题目</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary hover:underline"
            >
              录入第一道题目
            </button>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getDifficultyBadge(question.difficulty)}
                    {getTypeBadge(question.type)}
                    <span className="text-xs text-gray-500">
                      {getKnowledgePointName(question.knowledgePointId)}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {question.content}
                  </h3>

                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">答案：</span>
                      <span className="text-primary font-semibold">
                        {question.answer}
                      </span>
                    </div>
                    {expandedQuestion === question.id && question.analysis && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-700 mb-1">解析：</div>
                        <div className="text-gray-600 whitespace-pre-wrap">
                          {question.analysis}
                        </div>
                      </div>
                    )}
                  </div>

                  {question.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title={expandedQuestion === question.id ? '收起' : '查看详情'}
                  >
                    {expandedQuestion === question.id ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl sm:max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">录入新题目</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <QuestionForm onSuccess={handleQuestionCreated} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
