import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import { sampleQuestions } from '../data/initialData';
import { SM2Algorithm } from '../utils/sm2';

interface MistakeRecord {
  questionId: number;
  wrongCount: number;
  lastReviewTime: string;
  nextReviewTime: string;
  mastery: number;
}

export default function Mistakes() {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  useEffect(() => {
    const storedMistakes: MistakeRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('question_record_')) {
        const record = JSON.parse(localStorage.getItem(key) || '{}');
        if (record.reviewCount > 0) {
          const question = sampleQuestions.find((q) => q.id === record.questionId);
          if (question) {
            storedMistakes.push({
              questionId: record.questionId,
              wrongCount: record.repetition === 0 ? record.reviewCount : 0,
              lastReviewTime: record.lastReviewTime || new Date().toISOString(),
              nextReviewTime: record.nextReviewTime || new Date().toISOString(),
              mastery: SM2Algorithm.calculateMasteryRate(
                record.easeFactor || 2.5,
                record.repetition || 0
              ),
            });
          }
        }
      }
    }
    setMistakes(storedMistakes.sort((a, b) => a.mastery - b.mastery));
  }, []);

  const reviewNowCount = mistakes.filter((m) => {
    return new Date(m.nextReviewTime) <= new Date();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">错题本</h1>
          <p className="text-gray-500 mt-1 text-sm">
            系统会根据间隔重复算法自动安排复习时间
          </p>
        </div>
        {reviewNowCount > 0 && (
          <Link
            to={`/practice/${mistakes[0]?.questionId}`}
            className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>立即复习 ({reviewNowCount})</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 sm:p-6 text-center"
        >
          <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">📚</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary">{mistakes.length}</div>
          <div className="text-gray-500 text-xs sm:text-sm mt-1">错题总数</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 sm:p-6 text-center"
        >
          <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">⏰</div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-500">{reviewNowCount}</div>
          <div className="text-gray-500 text-xs sm:text-sm mt-1">待复习</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 sm:p-6 text-center"
        >
          <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">📈</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-500">
            {mistakes.length > 0
              ? Math.round(
                  mistakes.reduce((sum, m) => sum + m.mastery, 0) / mistakes.length
                )
              : 0}
            %
          </div>
          <div className="text-gray-500 text-xs sm:text-sm mt-1">平均掌握度</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-xl font-serif font-semibold mb-4">错题列表</h2>

        {mistakes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              太棒了！暂无错题记录
            </h3>
            <p className="text-gray-500 mb-6">
              继续保持，去挑战更多题目吧！
            </p>
            <Link to="/knowledge" className="btn-primary">
              开始练习
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mistakes.map((mistake) => {
              const question = sampleQuestions.find(
                (q) => q.id === mistake.questionId
              );
              if (!question) return null;

              const needsReview = new Date(mistake.nextReviewTime) <= new Date();

              return (
                <div
                  key={mistake.questionId}
                  className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                    needsReview
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                        {needsReview && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-500 text-white">
                            待复习
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            question.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : question.difficulty === 'medium'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {question.difficulty === 'easy'
                            ? '简单'
                            : question.difficulty === 'medium'
                            ? '中等'
                            : '困难'}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm mb-2 line-clamp-2">{question.content}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
                            {new Date(mistake.nextReviewTime).toLocaleDateString()}
                          </span>
                        </span>
                        <span>错误{mistake.wrongCount || 1}次</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 shrink-0">
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-bold text-primary">
                          {Math.round(mistake.mastery)}%
                        </div>
                        <div className="text-xs text-gray-500">掌握度</div>
                      </div>
                      <Link
                        to={`/practice/${question.knowledgePointId}`}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-xs sm:text-sm"
                      >
                        再练一次
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 bg-gradient-to-r from-primary to-primary-light text-white"
      >
        <div className="flex items-start space-x-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-semibold text-lg mb-2">间隔重复原理</h3>
            <p className="text-white text-opacity-90 text-sm">
              错题本基于SM-2间隔重复算法，当你对一道题回答正确后，系统会逐渐拉长复习间隔：
              1天 → 6天 → 15天 → 1个月...
              如果中途答错，间隔会重新缩短。通过反复巩固，帮助你将知识从短期记忆转化为长期记忆。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
