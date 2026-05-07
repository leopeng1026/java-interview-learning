import { useParams, Link } from 'react-router-dom';
import { usePracticeStore } from '../store/practiceStore';
import { motion } from 'framer-motion';

export default function PracticeResult() {
  const { pointId } = useParams<{ pointId: string }>();
  const { session, history, resetPractice } = usePracticeStore();

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-gray-600 mb-4">
          暂无练习记录
        </h2>
        <Link to="/knowledge" className="btn-primary">
          返回知识树
        </Link>
      </div>
    );
  }

  const correctCount = history.filter((h) => h.isCorrect).length;
  const totalCount = session.questions.length;
  const accuracy = Math.round((correctCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
      >
        <div className="text-6xl mb-4">
          {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          练习报告
        </h1>
        <p className="text-gray-600">
          {accuracy >= 80
            ? '太棒了！你对这个知识点掌握得很好！'
            : accuracy >= 60
            ? '不错的开始，继续保持！'
            : '别灰心，多练习几次就能掌握！'}
        </p>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-4xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-gray-600 mt-1">正确数</div>
          </div>
          <div className="bg-red-50 rounded-xl p-6">
            <div className="text-4xl font-bold text-red-600">
              {totalCount - correctCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">错误数</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-4xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-gray-600 mt-1">正确率</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/knowledge" className="btn-secondary">
            返回知识树
          </Link>
          <Link
            to={`/practice/${pointId}`}
            onClick={() => resetPractice()}
            className="btn-primary"
          >
            再练一组
          </Link>
          <Link to="/mistakes" className="btn-secondary">
            查看错题
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-xl font-serif font-semibold mb-4">答题详情</h2>
        <div className="space-y-3">
          {session.questions.map((question, index) => {
            const isCorrect = history[index]?.isCorrect;
            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-l-4 ${
                  isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {isCorrect ? '✓ 正确' : '✗ 错误'}
                      </span>
                      <span className="text-sm text-gray-500">
                        第{index + 1}题
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">
                      {question.content.substring(0, 80)}
                      {question.content.length > 80 ? '...' : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {totalCount - correctCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-xl font-serif font-semibold mb-4 text-red-600">
            💡 薄弱点提示
          </h2>
          <p className="text-gray-600">
            针对这些做错的题目，系统会在接下来的几天内安排复习。持续练习，直到完全掌握！
          </p>
        </motion.div>
      )}
    </div>
  );
}
