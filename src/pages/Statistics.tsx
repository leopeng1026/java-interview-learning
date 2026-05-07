import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const masteryByDomain = [
  { domain: '集合框架', mastery: 72, questions: 45 },
  { domain: 'JVM虚拟机', mastery: 58, questions: 55 },
  { domain: '多线程与并发', mastery: 52, questions: 50 },
  { domain: 'Spring框架', mastery: 48, questions: 80 },
  { domain: '数据库', mastery: 55, questions: 70 },
];

const difficultyDistribution = [
  { name: '已掌握', value: 35, color: '#4caf50' },
  { name: '熟悉', value: 25, color: '#2196f3' },
  { name: '学习中', value: 28, color: '#ff9800' },
  { name: '未开始', value: 12, color: '#9e9e9e' },
];

const weeklyProgress = [
  { day: '周一', questions: 25, accuracy: 65 },
  { day: '周二', questions: 32, accuracy: 68 },
  { day: '周三', questions: 28, accuracy: 70 },
  { day: '周四', questions: 35, accuracy: 72 },
  { day: '周五', questions: 40, accuracy: 75 },
  { day: '周六', questions: 45, accuracy: 78 },
  { day: '周日', questions: 30, accuracy: 80 },
];

const radarData = [
  { subject: '集合框架', A: 72, fullMark: 100 },
  { subject: 'JVM', A: 58, fullMark: 100 },
  { subject: '多线程', A: 52, fullMark: 100 },
  { subject: 'Spring', A: 48, fullMark: 100 },
  { subject: '数据库', A: 55, fullMark: 100 },
  { subject: '设计模式', A: 65, fullMark: 100 },
];

const recentActivity = [
  { date: '今天', type: '练习', content: 'HashMap原理与源码', score: 80 },
  { date: '昨天', type: '复习', content: 'ConcurrentHashMap', score: 65 },
  { date: '2天前', type: '练习', content: '垃圾回收', score: 72 },
  { date: '3天前', type: '复习', content: 'synchronized', score: 88 },
  { date: '4天前', type: '练习', content: 'JVM内存结构', score: 75 },
];

export default function Statistics() {
  const totalMastery =
    masteryByDomain.reduce((sum, d) => sum + d.mastery * d.questions, 0) /
    masteryByDomain.reduce((sum, d) => sum + d.questions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          学习统计
        </h1>
        <p className="text-gray-500 mt-1">
          全面了解你的学习进度与薄弱环节
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-primary">
            {Math.round(totalMastery)}%
          </div>
          <div className="text-gray-500 text-sm">整体掌握度</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">📝</div>
          <div className="text-3xl font-bold text-accent">235</div>
          <div className="text-gray-500 text-sm">累计答题</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">⏱️</div>
          <div className="text-3xl font-bold text-green-500">76%</div>
          <div className="text-gray-500 text-sm">平均正确率</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-orange-500">7</div>
          <div className="text-gray-500 text-sm">连续学习天数</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">
            各领域掌握度
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryByDomain}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mastery" fill="#1e3a5f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">
            知识点分布
          </h2>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">
            知识雷达图
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="掌握度"
                  dataKey="A"
                  stroke="#1e3a5f"
                  fill="#1e3a5f"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h2 className="text-lg font-serif font-semibold mb-4">
            最近活动
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.type === '练习'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {activity.type}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800">
                      {activity.content}
                    </div>
                    <div className="text-xs text-gray-500">{activity.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{activity.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h2 className="text-lg font-serif font-semibold mb-4">
          本周答题趋势
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="questions" fill="#f5a623" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="accuracy" fill="#4caf50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-sm text-gray-600">答题数</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">正确率%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
