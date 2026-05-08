import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import toast from 'react-hot-toast';
import apiService from '../services/api';

interface Option {
  key: string;
  value: string;
}

interface QuestionFormProps {
  onSuccess?: () => void;
}

export default function QuestionForm({ onSuccess }: QuestionFormProps) {
  const { tree } = useKnowledgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    knowledgePointId: '',
    content: '',
    answer: [] as string[],
    analysis: '',
    difficulty: 'medium',
    type: 'single_choice',
    tags: '',
    source: '',
  });

  const [options, setOptions] = useState<Option[]>([
    { key: 'A', value: '' },
    { key: 'B', value: '' },
    { key: 'C', value: '' },
    { key: 'D', value: '' },
  ]);

  const difficulties = [
    { value: 'easy', label: '简单', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: '中等', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'hard', label: '困难', color: 'bg-red-100 text-red-700' },
  ];

  const questionTypes = [
    { value: 'single_choice', label: '单选题' },
    { value: 'multiple_choice', label: '多选题' },
  ];

  const extractAllPoints = (nodes: any[], result: any[] = []): any[] => {
    nodes.forEach(node => {
      if (node.type === 'point') {
        result.push(node);
      }
      if (node.children) {
        extractAllPoints(node.children, result);
      }
    });
    return result;
  };

  const knowledgePoints = extractAllPoints(tree);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].value = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      const newKey = String.fromCharCode(65 + options.length);
      setOptions([...options, { key: newKey, value: '' }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions.map((opt, i) => ({
        ...opt,
        key: String.fromCharCode(65 + i)
      })));
    }
  };

  const handleAnswerChange = (key: string) => {
    setFormData(prev => {
      if (prev.type === 'single_choice') {
        return { ...prev, answer: [key] };
      } else {
        const newAnswer = prev.answer.includes(key)
          ? prev.answer.filter(a => a !== key)
          : [...prev.answer, key];
        return { ...prev, answer: newAnswer };
      }
    });
  };

  const validateForm = (): boolean => {
    if (!formData.knowledgePointId) {
      toast.error('请选择知识点');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('请输入题目内容');
      return false;
    }
    if (options.some(opt => !opt.value.trim())) {
      toast.error('请填写所有选项内容');
      return false;
    }
    if (formData.answer.length === 0) {
      toast.error('请选择正确答案');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const questionData = {
        knowledgePointId: parseInt(formData.knowledgePointId),
        content: formData.content,
        answer: formData.answer.join(','),
        analysis: formData.analysis,
        difficulty: formData.difficulty,
        type: formData.type,
        tags: formData.tags,
        source: formData.source,
        options: options.map(opt => ({
          key: opt.key,
          value: opt.value,
        })),
      };

      await apiService.createQuestion(questionData);

      toast.success('题目创建成功！');

      setFormData({
        knowledgePointId: '',
        content: '',
        answer: [],
        analysis: '',
        difficulty: 'medium',
        type: 'single_choice',
        tags: '',
        source: '',
      });
      setOptions([
        { key: 'A', value: '' },
        { key: 'B', value: '' },
        { key: 'C', value: '' },
        { key: 'D', value: '' },
      ]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create question:', error);
      toast.error('创建题目失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 sm:p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-lg sm:text-xl font-serif font-semibold mb-6 flex items-center space-x-2">
        <span className="text-2xl">📝</span>
        <span>录入新题目</span>
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            所属知识点 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.knowledgePointId}
            onChange={(e) => setFormData({ ...formData, knowledgePointId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">请选择知识点</option>
            {knowledgePoints.map(point => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              题目类型
            </label>
            <div className="flex space-x-2">
              {questionTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setFormData({
                    ...formData,
                    type: type.value,
                    answer: []
                  })}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.type === type.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              难度等级
            </label>
            <div className="flex space-x-2">
              {difficulties.map(diff => (
                <button
                  key={diff.value}
                  onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.difficulty === diff.value
                      ? `${diff.color} border-current`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            题目内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="请输入题目内容..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              选项内容 <span className="text-red-500">*</span>
            </label>
            {formData.type === 'multiple_choice' && (
              <span className="text-xs text-gray-500">多选题可选多个答案</span>
            )}
          </div>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <button
                  onClick={() => handleAnswerChange(option.key)}
                  className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all flex-shrink-0 ${
                    formData.answer.includes(option.key)
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300 text-gray-600 hover:border-primary'
                  }`}
                >
                  {option.key}
                </button>
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={`选项 ${option.key}`}
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button
              onClick={addOption}
              className="mt-3 flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>添加选项</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            题目解析
          </label>
          <textarea
            value={formData.analysis}
            onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="请输入题目解析（可选）..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="多个标签用逗号分隔"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              来源
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="如：2024字节跳动校招"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>保存题目</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
