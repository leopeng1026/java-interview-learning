import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useProgressStore } from '../store/progressStore';
import ImportExport from '../components/ImportExport';
import PracticeSelector from '../components/PracticeSelector';

const weeklyData = [
  { day: '周一', questions: 25, mastery: 65 },
  { day: '周二', questions: 32, mastery: 68 },
  { day: '周三', questions: 28, mastery: 70 },
  { day: '周四', questions: 35, mastery: 72 },
  { day: '周五', questions: 40, mastery: 75 },
  { day: '周六', questions: 45, mastery: 78 },
  { day: '周日', questions: 30, mastery: 80 },
];

export default function Home() {
  const navigate = useNavigate();
  const { progress, initializeProgress, updateStreak, getTodayStats, getDueReviews, getWeakPoints } = useProgressStore();
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    initializeProgress();
    updateStreak();
  }, [initializeProgress, updateStreak]);

  const todayStats = getTodayStats();
  const dueReviews = getDueReviews();
  const weakPoints = getWeakPoints(3);

  const handleSelectPractice = (knowledgePointId: number) => {
    setShowSelector(false);
    setTimeout(() => {
      if (knowledgePointId === 0) {
        navigate('/practice/review');
      } else {
        navigate(`/practice/${knowledgePointId}`);
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            学习仪表盘
          </h1>
          <p className="text-gray-500 mt-1">
            {progress.statistics.currentStreak > 0 ? (
              <>持续学习，深度巩固 - 第{progress.statistics.currentStreak}天连续学习 🔥</>
            ) : (
              <>开始你的学习之旅吧！</>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="btn-primary flex items-center space-x-2"
          >
            <span>选择练习</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 sm:p-5 lg:p-6"
        >
          <div className="text-3xl sm:text-4xl mb-2">🎯</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {Math.round(progress.statistics.averageMastery * 100)}%
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">整体掌握度</div>
          <div className="mt-2 bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-primary h-1.5 sm:h-2 rounded-full transition-all"
              style={{ width: `${progress.statistics.averageMastery * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-4 sm:p-5 lg:p-6"
        >
          <div className="text-3xl sm:text-4xl mb-2">📝</div>
          <div className="text-2xl sm:text-3xl font-bold text-accent">
            {progress.statistics.totalPracticed}
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">累计答题数</div>
          <div className="text-xs text-gray-400 mt-1">
            正确 {progress.statistics.totalCorrect} / 错误 {progress.statistics.totalWrong}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 sm:p-5 lg:p-6"
        >
          <div className="text-3xl sm:text-4xl mb-2">📚</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-500">
            {Object.values(progress.knowledgePoints).filter(kp => kp.totalAnswered > 0).length}
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">已练习知识点</div>
          <div className="text-xs text-gray-400 mt-1">
            共 {Object.keys(progress.knowledgePoints).length} 个知识点
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-4 sm:p-5 lg:p-6"
        >
          <div className="text-3xl sm:text-4xl mb-2">🔥</div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-500">
            {progress.statistics.currentStreak}
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">连续学习天数</div>
          <div className="text-xs text-gray-400 mt-1">
            历史最长：{progress.statistics.longestStreak} 天
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4 sm:p-6 lg:col-span-2"
        >
          <h2 className="text-base sm:text-lg font-serif font-semibold mb-3 sm:mb-4">本周学习趋势</h2>
          <div className="h-48 sm:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#7f8c8d" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#1e3a5f" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f5a623" tick={{ fontSize: 10 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="questions"
                  stroke="#1e3a5f"
                  strokeWidth={2}
                  dot={{ fill: '#1e3a5f', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mastery"
                  stroke="#f5a623"
                  strokeWidth={2}
                  dot={{ fill: '#f5a623', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-8 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-gray-600">答题数</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-gray-600">掌握度%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-6"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">今日任务</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📖</span>
                <span className="text-sm font-medium text-gray-700">
                  今日答题
                </span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-primary">
                {todayStats.practiced}题
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✓</span>
                <span className="text-sm font-medium text-gray-700">
                  正确率
                </span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-green-600">
                {todayStats.accuracy}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔄</span>
                <span className="text-sm font-medium text-gray-700">
                  待复习
                </span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-orange-600">
                {dueReviews.length}题
              </span>
            </div>
          </div>
          {dueReviews.length > 0 && (
            <Link
              to="/practice/112"
              className="w-full mt-4 btn-primary text-center block text-sm"
            >
              开始复习
            </Link>
          )}
        </motion.div>
      </div>

      {weakPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">
            ⚠️ 需要加强的知识点
          </h2>
          <div className="space-y-3">
            {weakPoints.map((point) => (
              <div
                key={point.knowledgePointId}
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-800">{point.name}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-500">
                      {Math.round(point.mastery * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">掌握度</div>
                  </div>
                  <Link
                    to={`/practice/${point.knowledgePointId}`}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    去练习
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showSelector && (
        <PracticeSelector onSelect={handleSelectPractice} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <ImportExport />
      </motion.div>
    </div>
  );
}
