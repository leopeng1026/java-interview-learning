import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, ChevronLeft } from 'lucide-react';
import { usePracticeStore } from '../store/practiceStore';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { useProgressStore } from '../store/progressStore';
import { SM2Algorithm } from '../utils/sm2';

export default function Practice() {
  const { pointId } = useParams<{ pointId: string }>();
  const navigate = useNavigate();
  const {
    session,
    currentFeedback,
    selectedAnswer,
    startPractice,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    finishPractice,
    resetPractice,
  } = usePracticeStore();
  const { getNodePath } = useKnowledgeStore();
  const { recordAnswer } = useProgressStore();

  useEffect(() => {
    if (pointId) {
      startPractice(parseInt(pointId), 5);
    }
    return () => {
      resetPractice();
    };
  }, [pointId, startPractice, resetPractice]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">⚡</div>
          <p className="text-gray-600">正在加载题目...</p>
        </div>
      </div>
    );
  }

  if (session.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6 sm:p-8 text-center"
        >
          <div className="text-5xl sm:text-6xl mb-4">📚</div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
            暂无题目
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            该知识点目前暂无练习题目，敬请期待更新
          </p>
          <button
            onClick={() => navigate(`/knowledge/${pointId}`)}
            className="btn-primary w-full sm:w-auto"
          >
            返回知识点
          </button>
        </motion.div>
      </div>
    );
  }

  if (session.isCompleted) {
    const correctCount = session.history?.filter(h => h.isCorrect).length || 0;
    const accuracy = Math.round((correctCount / session.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6 sm:p-8 text-center"
        >
          <div className="text-5xl sm:text-6xl mb-4">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
            练习完成！
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            你已完成本次{getNodePath(session.knowledgePointId)[0]?.name || '专项'}练习
          </p>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {correctCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">正确数</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {session.questions.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">总题数</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {accuracy}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">正确率</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => navigate(`/knowledge/${pointId}`)}
              className="btn-secondary w-full sm:w-auto"
            >
              返回知识点
            </button>
            <button
              onClick={() => {
                startPractice(parseInt(pointId || '0'), 5);
              }}
              className="btn-primary w-full sm:w-auto"
            >
              再练一组
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentIndex];
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;

  const handleSubmitAnswer = () => {
    const feedback = submitAnswer();

    recordAnswer({
      questionId: currentQuestion.id,
      knowledgePointId: currentQuestion.knowledgePointId,
      isCorrect: feedback.isCorrect,
      userAnswer: feedback.yourAnswer,
      correctAnswer: feedback.correctAnswer,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-3 sm:mb-4">
        <button
          onClick={() => navigate(`/knowledge/${pointId}`)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">退出练习</span>
        </button>
      </div>

      <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-500">
            第{session.currentIndex + 1}题 / 共{session.questions.length}题
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {currentQuestion.difficulty === 'easy'
                ? '简单'
                : currentQuestion.difficulty === 'medium'
                ? '中等'
                : '困难'}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="card p-4 sm:p-6 sm:p-8 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-xl font-medium text-gray-900 mb-6">
            {currentQuestion.content}
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer.includes(option.key);
              const isCorrectAnswer = currentFeedback?.correctAnswer.includes(option.key);
              const isYourAnswer = currentFeedback?.yourAnswer.includes(option.key);

              return (
                <button
                  key={option.key}
                  onClick={() => !currentFeedback && selectAnswer(option.key)}
                  disabled={!!currentFeedback}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                    currentFeedback
                      ? isCorrectAnswer
                        ? 'border-green-500 bg-green-50'
                        : isYourAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : isSelected
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                  } ${!currentFeedback && 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-sm flex-shrink-0 ${
                        currentFeedback
                          ? isCorrectAnswer
                            ? 'border-green-500 bg-green-500 text-white'
                            : isYourAnswer
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300'
                          : isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {option.key}
                    </div>
                    <span className="flex-1 text-sm sm:text-base">{option.value}</span>
                    {currentFeedback && isCorrectAnswer && (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                    )}
                    {currentFeedback && isYourAnswer && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {currentFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`card p-4 sm:p-6 mb-4 sm:mb-6 ${
              currentFeedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border-2`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  currentFeedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {currentFeedback.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-base sm:text-lg font-semibold ${
                    currentFeedback.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {currentFeedback.isCorrect ? '回答正确！' : '回答错误'}
                </h3>
                {!currentFeedback.isCorrect && (
                  <p className="text-sm text-gray-600">
                    正确答案：{currentFeedback.correctAnswer.join('、')}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📖 详细解析</h4>
              <div className="prose prose-sm text-gray-600 whitespace-pre-line text-xs sm:text-sm max-h-48 sm:max-h-64 overflow-y-auto">
                {currentFeedback.analysis.content}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">💡 关联知识点</h4>
              <div className="flex flex-wrap gap-2">
                {currentFeedback.analysis.knowledgePoints.map((kp) => (
                  <span
                    key={kp.id}
                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-primary bg-opacity-10 text-primary"
                  >
                    {kp.name} ({Math.round(kp.masteryRate * 100)}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700">
              💡 系统已将此题目加入间隔重复队列，预计{' '}
              {(() => {
                const quality = currentFeedback.isCorrect ? 3 : 0;
                const result = SM2Algorithm.calculate({
                  quality,
                  easeFactor: 2.5,
                  interval: 1,
                  repetition: 0,
                });
                return `${result.intervalDays}天后`;
              })()}
              再次出现。
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between">
        {!currentFeedback ? (
          <div />
        ) : session.currentIndex === session.questions.length - 1 ? (
          <button
            onClick={finishPractice}
            className="btn-primary flex-1 sm:flex-none sm:px-8 py-3"
          >
            完成练习
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn-primary flex-1 sm:flex-none sm:px-8 py-3 flex items-center justify-center space-x-2"
          >
            <span>下一题</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {!currentFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer.length === 0}
            className="btn-primary flex-1 sm:flex-none sm:px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交答案
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
