import { useParams, Link } from 'react-router-dom';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { sampleQuestions } from '../data/initialData';

export default function KnowledgeDetail() {
  const { id } = useParams<{ id: string }>();
  const { getNodePath } = useKnowledgeStore();
  const nodeId = parseInt(id || '0');

  const path = getNodePath(nodeId);
  const currentNode = path[path.length - 1];
  const questions = sampleQuestions.filter((q) => q.knowledgePointId === nodeId);

  if (!currentNode) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-gray-600">知识点不存在</h2>
        <Link to="/knowledge" className="btn-primary mt-4 inline-block">
          返回知识树
        </Link>
      </div>
    );
  }

  const difficultyStats = {
    easy: questions.filter((q) => q.difficulty === 'easy').length,
    medium: questions.filter((q) => q.difficulty === 'medium').length,
    hard: questions.filter((q) => q.difficulty === 'hard').length,
    expert: questions.filter((q) => q.difficulty === 'expert').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {path.map((node, index) => (
          <span key={node.id} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <span className={index === path.length - 1 ? 'text-primary font-medium' : ''}>
              {node.name}
            </span>
          </span>
        ))}
      </div>

      <div className="card p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              {currentNode.name}
            </h1>
            {currentNode.description && (
              <p className="text-gray-600 mt-2">{currentNode.description}</p>
            )}
          </div>
          {currentNode.type === 'point' && (
            <Link
              to={`/practice/${currentNode.id}`}
              className="btn-primary text-lg px-8 py-3"
            >
              开始练习
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {difficultyStats.easy}
            </div>
            <div className="text-sm text-gray-600">简单</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {difficultyStats.medium}
            </div>
            <div className="text-sm text-gray-600">中等</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {difficultyStats.hard}
            </div>
            <div className="text-sm text-gray-600">困难</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">
              {difficultyStats.expert}
            </div>
            <div className="text-sm text-gray-600">专家</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-serif font-semibold mb-4">
          相关题目列表 ({questions.length})
        </h2>
        <div className="space-y-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        question.difficulty === 'easy'
                          ? 'bg-green-100 text-green-700'
                          : question.difficulty === 'medium'
                          ? 'bg-blue-100 text-blue-700'
                          : question.difficulty === 'hard'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {question.difficulty === 'easy'
                        ? '简单'
                        : question.difficulty === 'medium'
                        ? '中等'
                        : question.difficulty === 'hard'
                        ? '困难'
                        : '专家'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {question.type === 'single_choice'
                        ? '单选题'
                        : question.type === 'multiple_choice'
                        ? '多选题'
                        : '编程题'}
                    </span>
                  </div>
                  <p className="text-gray-800">{question.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {question.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs bg-gray-50 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
