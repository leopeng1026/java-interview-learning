import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Target, FileQuestion, BookOpen, Flame } from 'lucide-react';
import { useProgressStore } from '../store/progressStore';
import ImportExport from '../components/ImportExport';

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
  const { progress, initializeProgress, updateStreak, getTodayStats, getDueReviews, getWeakPoints } = useProgressStore();

  useEffect(() => {
    initializeProgress();
    updateStreak();
  }, [initializeProgress, updateStreak]);

  const todayStats = getTodayStats();
  const dueReviews = getDueReviews();
  const weakPoints = getWeakPoints(3);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            学习仪表盘
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            {progress.statistics.currentStreak > 0 ? (
              <>第{progress.statistics.currentStreak}天连续学习 🔥</>
            ) : (
              <>开始你的学习之旅吧！</>
            )}
          </p>
        </div>
        <Link
          to="/practice/112"
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <span>开始练习</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary bg-opacity-10 flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {Math.round(progress.statistics.averageMastery * 100)}%
            </div>
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
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent bg-opacity-10 flex items-center justify-center">
              <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-accent">
              {progress.statistics.totalPracticed}
            </div>
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">累计答题数</div>
          <div className="text-xs text-gray-400 mt-1 hidden sm:block">
            正确 {progress.statistics.totalCorrect} / 错误 {progress.statistics.totalWrong}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500 bg-opacity-10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-500">
              {Object.values(progress.knowledgePoints).filter(kp => kp.totalAnswered > 0).length}
            </div>
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">已练习知识点</div>
          <div className="text-xs text-gray-400 mt-1 hidden sm:block">
            共 {Object.keys(progress.knowledgePoints).length} 个
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-4 sm:p-6 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500 bg-opacity-10 flex items-center justify-center">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-500">
              {progress.statistics.currentStreak}
            </div>
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">连续学习天数</div>
          <div className="text-xs text-gray-400 mt-1 hidden sm:block">
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
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#7f8c8d" fontSize={12} />
                <YAxis yAxisId="left" stroke="#1e3a5f" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#f5a623" fontSize={12} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="questions"
                  stroke="#1e3a5f"
                  strokeWidth={2}
                  dot={{ fill: '#1e3a5f' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mastery"
                  stroke="#f5a623"
                  strokeWidth={2}
                  dot={{ fill: '#f5a623' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-xs sm:text-sm text-gray-600">答题数</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-xs sm:text-sm text-gray-600">掌握度%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-serif font-semibold mb-3 sm:mb-4">今日任务</h2>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">📖</span>
                <span className="text-sm font-medium text-gray-700">今日答题</span>
              </div>
              <span className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-primary">
                {todayStats.practiced}题
              </span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">✓</span>
                <span className="text-sm font-medium text-gray-700">正确率</span>
              </div>
              <span className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-green-600">
                {todayStats.accuracy}%
              </span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">🔄</span>
                <span className="text-sm font-medium text-gray-700">待复习</span>
              </div>
              <span className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-orange-600">
                {dueReviews.length}题
              </span>
            </div>
          </div>
          {dueReviews.length > 0 && (
            <Link
              to="/practice/112"
              className="w-full mt-3 sm:mt-4 btn-primary text-center block text-sm py-2"
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
          className="card p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-serif font-semibold mb-3 sm:mb-4">
            ⚠️ 需要加强的知识点
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {weakPoints.map((point) => (
              <div
                key={point.knowledgePointId}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-orange-50 rounded-lg gap-2"
              >
                <div className="font-medium text-gray-800 text-sm sm:text-base">{point.name}</div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-500">
                      {Math.round(point.mastery * 100)}%
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">掌握度</div>
                  </div>
                  <Link
                    to={`/practice/${point.knowledgePointId}`}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
                  >
                    去练习
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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
