import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnswerFeedback, PracticeSession } from '../types';
import { sampleQuestions } from '../data/initialData';
import { SM2Algorithm } from '../utils/sm2';

interface PracticeState {
  session: PracticeSession | null;
  currentFeedback: AnswerFeedback | null;
  selectedAnswer: string[];
  history: Array<{
    questionId: number;
    isCorrect: boolean;
    answeredAt: Date;
  }>;

  startPractice: (knowledgePointId: number, questionCount?: number) => void;
  selectAnswer: (optionKey: string) => void;
  submitAnswer: () => AnswerFeedback;
  nextQuestion: () => void;
  finishPractice: () => PracticeSession | null;
  resetPractice: () => void;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      session: null,
      currentFeedback: null,
      selectedAnswer: [],
      history: [],

      startPractice: (knowledgePointId, questionCount = 10) => {
        const questions = sampleQuestions
          .filter(q => q.knowledgePointId === knowledgePointId)
          .slice(0, questionCount);

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
        });
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
        });
      },
    }),
    {
      name: 'practice-storage',
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);
