import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SM2Algorithm } from '../utils/sm2';
import { initialKnowledgeTree } from '../data/initialData';

export interface QuestionRecord {
  questionId: number;
  knowledgePointId: number;
  times: number;
  correct: number;
  wrong: number;
  lastAnswer: string;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReview: string;
  lastReview: string;
}

export interface KnowledgePointProgress {
  knowledgePointId: number;
  name: string;
  mastery: number;
  totalAnswered: number;
  correctRate: number;
  lastPractice: string;
  nextReview: string;
  questions: number[];
}

export interface UserStatistics {
  totalQuestions: number;
  totalPracticed: number;
  totalCorrect: number;
  totalWrong: number;
  averageMastery: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
  practiceDays: number;
}

export interface UserProgress {
  version: string;
  lastUpdated: string;
  statistics: UserStatistics;
  knowledgePoints: Record<number, KnowledgePointProgress>;
  questionRecords: Record<number, QuestionRecord>;
  dailyPractice: Record<string, { date: string; count: number; correct: number }>;
}

const initialProgress: UserProgress = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  statistics: {
    totalQuestions: 0,
    totalPracticed: 0,
    totalCorrect: 0,
    totalWrong: 0,
    averageMastery: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: '',
    practiceDays: 0,
  },
  knowledgePoints: {},
  questionRecords: {},
  dailyPractice: {},
};

interface ProgressState {
  progress: UserProgress;

  initializeProgress: () => void;
  recordAnswer: (params: {
    questionId: number;
    knowledgePointId: number;
    isCorrect: boolean;
    userAnswer: string[];
    correctAnswer: string[];
  }) => void;
  updateStreak: () => void;
  getQuestionProgress: (questionId: number) => QuestionRecord | null;
  getKnowledgePointProgress: (knowledgePointId: number) => KnowledgePointProgress | null;
  getDueReviews: () => QuestionRecord[];
  getWeakPoints: (limit?: number) => Array<{ knowledgePointId: number; name: string; mastery: number }>;
  exportProgress: () => string;
  importProgress: (jsonString: string) => boolean;
  getTodayStats: () => { practiced: number; correct: number; accuracy: number };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      initializeProgress: () => {
        const { progress } = get();
        if (Object.keys(progress.knowledgePoints).length === 0) {
          initialKnowledgeTree.forEach((lib) => {
            lib.children?.forEach((domain) => {
              domain.children?.forEach((point) => {
                if (!progress.knowledgePoints[point.id]) {
                  progress.knowledgePoints[point.id] = {
                    knowledgePointId: point.id,
                    name: point.name,
                    mastery: 0,
                    totalAnswered: 0,
                    correctRate: 0,
                    lastPractice: '',
                    nextReview: '',
                    questions: [],
                  };
                }
              });
            });
          });
          set({ progress: { ...progress } });
        }
      },

      recordAnswer: ({ questionId, knowledgePointId, isCorrect, userAnswer, correctAnswer }) => {
        const { progress } = get();
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        let record = progress.questionRecords[questionId];
        const quality = isCorrect ? (userAnswer.length === 1 ? 3 : 4) : 0;

        if (record) {
          const newRecord = SM2Algorithm.calculate({
            quality,
            easeFactor: record.easeFactor,
            interval: record.interval,
            repetition: record.repetition,
          });

          record = {
            ...record,
            times: record.times + 1,
            correct: isCorrect ? record.correct + 1 : record.correct,
            wrong: isCorrect ? record.wrong : record.wrong + 1,
            lastAnswer: now.toISOString(),
            easeFactor: newRecord.easeFactor,
            interval: newRecord.intervalDays,
            repetition: newRecord.repetition,
            nextReview: newRecord.nextReviewTime.toISOString(),
            lastReview: now.toISOString(),
          };
        } else {
          const newRecord = SM2Algorithm.calculate({
            quality,
            easeFactor: 2.5,
            interval: 1,
            repetition: 0,
          });

          record = {
            questionId,
            knowledgePointId,
            times: 1,
            correct: isCorrect ? 1 : 0,
            wrong: isCorrect ? 0 : 1,
            lastAnswer: now.toISOString(),
            easeFactor: newRecord.easeFactor,
            interval: newRecord.intervalDays,
            repetition: newRecord.repetition,
            nextReview: newRecord.nextReviewTime.toISOString(),
            lastReview: now.toISOString(),
          };
        }

        const kpProgress = progress.knowledgePoints[knowledgePointId];
        if (kpProgress) {
          const questionIds = new Set([...kpProgress.questions, questionId]);
          const answeredQuestions = Array.from(questionIds);
          const totalCorrect = answeredQuestions.reduce((sum, qId) => {
            return sum + (progress.questionRecords[qId]?.correct || 0);
          }, isCorrect ? 1 : 0);

          kpProgress.questions = answeredQuestions;
          kpProgress.totalAnswered = answeredQuestions.length;
          kpProgress.correctRate = answeredQuestions.length > 0
            ? totalCorrect / answeredQuestions.length
            : 0;
          kpProgress.mastery = SM2Algorithm.calculateMasteryRate(
            record.easeFactor,
            record.repetition
          ) / 100;
          kpProgress.lastPractice = today;

          const dueRecords = Object.values(progress.questionRecords)
            .filter(r => r.knowledgePointId === knowledgePointId && r.nextReview)
            .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
          kpProgress.nextReview = dueRecords.length > 0
            ? dueRecords[0].nextReview
            : record.nextReview;
        }

        const dailyStats = progress.dailyPractice[today] || { date: today, count: 0, correct: 0 };
        dailyStats.count += 1;
        if (isCorrect) dailyStats.correct += 1;

        const totalPracticed = Object.values(progress.questionRecords).reduce((sum, r) => sum + r.times, 0);
        const totalCorrect = Object.values(progress.questionRecords).reduce((sum, r) => sum + r.correct, 0);
        const totalWrong = totalPracticed - totalCorrect;

        const kpMasteries = Object.values(progress.knowledgePoints)
          .filter(kp => kp.totalAnswered > 0)
          .map(kp => kp.mastery);
        const averageMastery = kpMasteries.length > 0
          ? kpMasteries.reduce((sum, m) => sum + m, 0) / kpMasteries.length
          : 0;

        let { currentStreak, longestStreak, practiceDays } = progress.statistics;
        const lastPracticeDate = progress.statistics.lastPracticeDate;

        if (lastPracticeDate !== today) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastPracticeDate === yesterdayStr) {
            currentStreak += 1;
          } else if (lastPracticeDate && lastPracticeDate !== today) {
            currentStreak = 1;
          } else if (!lastPracticeDate) {
            currentStreak = 1;
          }

          longestStreak = Math.max(longestStreak, currentStreak);
          practiceDays += 1;
        }

        set({
          progress: {
            ...progress,
            version: '1.0',
            lastUpdated: now.toISOString(),
            statistics: {
              totalQuestions: Object.keys(progress.questionRecords).length,
              totalPracticed,
              totalCorrect,
              totalWrong,
              averageMastery: Math.round(averageMastery * 100) / 100,
              currentStreak,
              longestStreak,
              lastPracticeDate: today,
              practiceDays,
            },
            knowledgePoints: {
              ...progress.knowledgePoints,
              [knowledgePointId]: kpProgress,
            },
            questionRecords: {
              ...progress.questionRecords,
              [questionId]: record,
            },
            dailyPractice: {
              ...progress.dailyPractice,
              [today]: dailyStats,
            },
          },
        });
      },

      updateStreak: () => {
        const { progress } = get();
        const today = new Date().toISOString().split('T')[0];
        const lastPracticeDate = progress.statistics.lastPracticeDate;

        if (lastPracticeDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let currentStreak = progress.statistics.currentStreak;
          if (lastPracticeDate === yesterdayStr || !lastPracticeDate) {
            currentStreak = lastPracticeDate ? currentStreak + 1 : 1;
          } else {
            currentStreak = 1;
          }

          set({
            progress: {
              ...progress,
              statistics: {
                ...progress.statistics,
                currentStreak,
                longestStreak: Math.max(progress.statistics.longestStreak, currentStreak),
              },
            },
          });
        }
      },

      getQuestionProgress: (questionId) => {
        const { progress } = get();
        return progress.questionRecords[questionId] || null;
      },

      getKnowledgePointProgress: (knowledgePointId) => {
        const { progress } = get();
        return progress.knowledgePoints[knowledgePointId] || null;
      },

      getDueReviews: () => {
        const { progress } = get();
        const now = new Date();
        return Object.values(progress.questionRecords)
          .filter(record => new Date(record.nextReview) <= now)
          .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
      },

      getWeakPoints: (limit = 5) => {
        const { progress } = get();
        return Object.values(progress.knowledgePoints)
          .filter(kp => kp.totalAnswered > 0)
          .sort((a, b) => a.mastery - b.mastery)
          .slice(0, limit)
          .map(kp => ({
            knowledgePointId: kp.knowledgePointId,
            name: kp.name,
            mastery: kp.mastery,
          }));
      },

      exportProgress: () => {
        const { progress } = get();
        const exportData = {
          ...progress,
          exportedAt: new Date().toISOString(),
        };

        const content = `// 用户学习进度 - ${new Date().toLocaleDateString('zh-CN')}
// 此文件由系统自动生成，请勿手动修改

export const userProgress = ${JSON.stringify(exportData, null, 2)} as const;
`;

        return content;
      },

      importProgress: (jsonString) => {
        try {
          const jsonMatch = jsonString.match(/export\s+const\s+userProgress\s+=\s*([\s\S]*?)\s+as\s+const;/);
          if (!jsonMatch) {
            const imported = JSON.parse(jsonString);
            set({ progress: imported });
            return true;
          }

          const jsonData = JSON.parse(jsonMatch[1]);
          set({ progress: jsonData });
          return true;
        } catch (error) {
          console.error('导入进度失败:', error);
          return false;
        }
      },

      getTodayStats: () => {
        const { progress } = get();
        const today = new Date().toISOString().split('T')[0];
        const todayStats = progress.dailyPractice[today] || { date: today, count: 0, correct: 0 };

        return {
          practiced: todayStats.count,
          correct: todayStats.correct,
          accuracy: todayStats.count > 0
            ? Math.round((todayStats.correct / todayStats.count) * 100)
            : 0,
        };
      },
    }),
    {
      name: 'java-interview-progress',
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
