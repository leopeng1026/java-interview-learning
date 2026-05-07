export interface KnowledgeNode {
  id: number;
  name: string;
  type: 'library' | 'domain' | 'point';
  parentId?: number | null;
  icon?: string;
  color?: string;
  description?: string;
  questionCount?: number;
  masteryRate?: number;
  children?: KnowledgeNode[];
}

export interface Question {
  id: number;
  knowledgePointId: number;
  content: string;
  options: Array<{
    key: string;
    value: string;
  }>;
  answer: string[];
  analysis: {
    content: string;
    knowledgePoints: Array<{
      id: number;
      name: string;
      masteryRate: number;
    }>;
    relatedQuestions: number[];
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  type: 'single_choice' | 'multiple_choice' | 'coding';
  tags: string[];
  source?: string;
}

export interface PracticeSession {
  sessionId: string;
  knowledgePointId: number;
  questions: Question[];
  currentIndex: number;
  startTime: Date;
  isCompleted: boolean;
  history?: Array<{
    questionId: number;
    isCorrect: boolean;
    answeredAt: Date;
  }>;
}

export interface UserRecord {
  questionId: number;
  isCorrect: boolean;
  userAnswer: string[];
  correctAnswer: string[];
  score: number;
  easeFactor: number;
  intervalDays: number;
  repetition: number;
  nextReviewTime: Date;
  reviewCount: number;
}

export interface AnswerFeedback {
  isCorrect: boolean;
  correctAnswer: string[];
  yourAnswer: string[];
  analysis: {
    content: string;
    knowledgePoints: Array<{
      id: number;
      name: string;
      masteryRate: number;
    }>;
    relatedQuestions: number[];
  };
}
