import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: '周一', questions: 25, mastery: 65 },
  { day: '周二', questions: 32, mastery: 68 },
  { day: '周三', questions: 28, mastery: 70 },
  { day: '周四', questions: 35, mastery: 72 },
  { day: '周五', questions: 40, mastery: 75 },
  { day: '周六', questions: 45, mastery: 78 },
  { day: '周日', questions: 30, mastery: 80 },
];

const weakPoints = [
  { id: 113, name: 'ConcurrentHashMap', mastery: 0.45, questions: 15 },
  { id: 132, name: 'volatile与内存屏障', mastery: 0.48, questions: 12 },
  { id: 134, name: 'AQS与ReentrantLock', mastery: 0.35, questions: 5 },
  { id: 122, name: '垃圾回收', mastery: 0.50, questions: 25 },
];

const todayTasks = [
  { type: 'review', title: 'HashMap待复习', count: 8, icon: '🔄' },
  { type: 'weak', title: '薄弱点强化', count: 5, icon: '💪' },
  { type: 'new', title: '新知识点', count: 3, icon: '📖' },
];

export default function Home() {
  const totalMastery = 68;
  const totalQuestions = 235;
  const streak = 7;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            学习仪表盘
          </h1>
          <p className="text-gray-500 mt-1">
            持续学习，深度巩固 - 第{streak}天连续学习 🔥
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/practice/112"
            className="btn-primary flex items-center space-x-2"
          >
            <span>开始练习</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-primary">{totalMastery}%</div>
          <div className="text-gray-500 text-sm">整体掌握度</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${totalMastery}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">📝</div>
          <div className="text-3xl font-bold text-accent">{totalQuestions}</div>
          <div className="text-gray-500 text-sm">累计答题数</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">📚</div>
          <div className="text-3xl font-bold text-green-500">12</div>
          <div className="text-gray-500 text-sm">已掌握知识点</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-orange-500">{streak}</div>
          <div className="text-gray-500 text-sm">连续学习天数</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">本周学习趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#7f8c8d" />
                <YAxis yAxisId="left" stroke="#1e3a5f" />
                <YAxis yAxisId="right" orientation="right" stroke="#f5a623" />
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
            {todayTasks.map((task) => (
              <div
                key={task.type}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{task.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {task.title}
                  </span>
                </div>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-primary">
                  {task.count}题
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 btn-secondary text-sm">
            查看全部任务 →
          </button>
        </motion.div>
      </div>

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
              key={point.id}
              className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-800">{point.name}</div>
                <div className="text-sm text-gray-500">
                  {point.questions}道相关题目
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-500">
                    {Math.round(point.mastery * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">掌握度</div>
                </div>
                <Link
                  to={`/practice/${point.id}`}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  去练习
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
