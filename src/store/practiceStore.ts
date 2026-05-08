import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnswerFeedback, PracticeSession, Question as LocalQuestion } from '../types';
import { sampleQuestions } from '../data/initialData';
import { SM2Algorithm } from '../utils/sm2';
import apiService, { Question as ApiQuestion } from '../services/api';

interface PracticeState {
  session: PracticeSession | null;
  currentFeedback: AnswerFeedback | null;
  selectedAnswer: string[];
  history: Array<{
    questionId: number;
    isCorrect: boolean;
    answeredAt: Date;
  }>;
  isLoading: boolean;
  error: string | null;
  useBackend: boolean;

  startPractice: (knowledgePointId: number, questionCount?: number) => Promise<void>;
  selectAnswer: (optionKey: string) => void;
  submitAnswer: () => AnswerFeedback;
  nextQuestion: () => void;
  finishPractice: () => PracticeSession | null;
  resetPractice: () => void;
  setUseBackend: (useBackend: boolean) => void;
}

const convertApiQuestion = (apiQuestion: ApiQuestion): LocalQuestion => {
  const answerStr = apiQuestion.answer || '';
  let answerArray: string[] = [];

  if (answerStr.includes(',')) {
    answerArray = answerStr.split(',').map(a => a.trim());
  } else if (answerStr.includes(' ')) {
    answerArray = answerStr.split(' ').map(a => a.trim()).filter(a => a);
  } else {
    answerArray = [answerStr];
  }

  return {
    id: apiQuestion.id,
    knowledgePointId: apiQuestion.knowledgePointId,
    content: apiQuestion.content,
    options: apiQuestion.options || [],
    answer: answerArray,
    analysis: apiQuestion.analysis ? {
      content: apiQuestion.analysis,
      knowledgePoints: [],
      relatedQuestions: [],
    } : undefined,
    difficulty: apiQuestion.difficulty,
    type: apiQuestion.type,
    tags: apiQuestion.tags?.split(',').map(t => t.trim()) || [],
    source: apiQuestion.source,
  };
};

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      session: null,
      currentFeedback: null,
      selectedAnswer: [],
      history: [],
      isLoading: false,
      error: null,
      useBackend: true,

      startPractice: async (knowledgePointId, questionCount = 10) => {
        const { useBackend } = get();

        set({ isLoading: true, error: null });

        try {
          let questions: LocalQuestion[];

          if (useBackend) {
            const apiQuestions = await apiService.getQuestionsByKnowledgePointId(knowledgePointId);
            questions = apiQuestions.map(convertApiQuestion);
          } else {
            questions = sampleQuestions
              .filter(q => q.knowledgePointId === knowledgePointId)
              .slice(0, questionCount);
          }

          if (questions.length === 0) {
            set({
              error: 'No questions found for this knowledge point',
              isLoading: false
            });
            return;
          }

          set({
            session: {
              sessionId: `ps_${Date.now()}`,
              knowledgePointId,
              questions,
              currentIndex: 0,
              startTime: new Date(),
              isCompleted: false,
              history: [],
            },
            currentFeedback: null,
            selectedAnswer: [],
            history: [],
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to fetch questions:', error);
          set({
            error: 'Failed to fetch questions from server, using local data',
            isLoading: false,
            session: {
              sessionId: `ps_${Date.now()}`,
              knowledgePointId,
              questions: sampleQuestions
                .filter(q => q.knowledgePointId === knowledgePointId)
                .slice(0, questionCount),
              currentIndex: 0,
              startTime: new Date(),
              isCompleted: false,
              history: [],
            },
            currentFeedback: null,
            selectedAnswer: [],
            history: [],
          });
        }
      },

      selectAnswer: (optionKey) => {
        const { session } = get();
        if (!session) return;

        const question = session.questions[session.currentIndex];
        if (!question) return;

        if (question.type === 'single_choice') {
          set({ selectedAnswer: [optionKey] });
        } else {
          const { selectedAnswer } = get();
          if (selectedAnswer.includes(optionKey)) {
            set({
              selectedAnswer: selectedAnswer.filter(a => a !== optionKey),
            });
          } else {
            set({ selectedAnswer: [...selectedAnswer, optionKey] });
          }
        }
      },

      submitAnswer: () => {
        const { session, selectedAnswer, history } = get();
        if (!session) {
          throw new Error('No active session');
        }

        const question = session.questions[session.currentIndex];
        const isCorrect =
          selectedAnswer.length === question.answer.length &&
          selectedAnswer.every(a => question.answer.includes(a));

        const feedback: AnswerFeedback = {
          isCorrect,
          correctAnswer: question.answer,
          yourAnswer: selectedAnswer,
          analysis: question.analysis,
        };

        const quality = isCorrect ? (selectedAnswer.length === 1 ? 3 : 4) : 0;
        const existingRecord = JSON.parse(
          localStorage.getItem(`question_record_${question.id}`) || '{}'
        );

        const newRecord = SM2Algorithm.calculate({
          quality,
          easeFactor: existingRecord.easeFactor || 2.5,
          interval: existingRecord.intervalDays || 1,
          repetition: existingRecord.repetition || 0,
        });

        localStorage.setItem(
          `question_record_${question.id}`,
          JSON.stringify({
            questionId: question.id,
            isCorrect,
            ...newRecord,
            reviewCount: (existingRecord.reviewCount || 0) + 1,
          })
        );

        set({
          currentFeedback: feedback,
          history: [
            ...history,
            {
              questionId: question.id,
              isCorrect,
              answeredAt: new Date(),
            },
          ],
        });

        return feedback;
      },

      nextQuestion: () => {
        const { session } = get();
        if (!session) return;

        const nextIndex = session.currentIndex + 1;

        if (nextIndex >= session.questions.length) {
          set({
            session: { ...session, isCompleted: true },
            currentFeedback: null,
            selectedAnswer: [],
          });
        } else {
          set({
            session: { ...session, currentIndex: nextIndex },
            currentFeedback: null,
            selectedAnswer: [],
          });
        }
      },

      finishPractice: () => {
        const { session } = get();
        if (session) {
          set({ session: { ...session, isCompleted: true } });
        }
        return get().session;
      },

      resetPractice: () => {
        set({
          session: null,
          currentFeedback: null,
          selectedAnswer: [],
          history: [],
          error: null,
        });
      },

      setUseBackend: (useBackend: boolean) => {
        set({ useBackend });
      },
    }),
    {
      name: 'practice-storage',
      partialize: (state) => ({
        history: state.history,
        useBackend: state.useBackend,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        history: persistedState?.history || [],
        useBackend: persistedState?.useBackend ?? true,
      }),
    }
  )
);
