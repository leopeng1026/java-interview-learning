const API_BASE_URL = 'http://localhost:8080/api';

export interface KnowledgeNode {
  id: number;
  name: string;
  type: string;
  description?: string;
  color?: string;
  questionCount: number;
  masteryRate: number;
  parentId?: number;
  children?: KnowledgeNode[];
  libraryId?: number;
  domainId?: number;
}

export interface QuestionOption {
  key: string;
  value: string;
}

export interface Question {
  id: number;
  knowledgePointId: number;
  content: string;
  options?: QuestionOption[];
  answer: string;
  analysis?: string;
  difficulty: string;
  type: string;
  tags?: string;
  source?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getKnowledgeTree(): Promise<KnowledgeNode[]> {
    return this.request<KnowledgeNode[]>('/knowledge/tree');
  }

  async getAllLibraries(): Promise<KnowledgeNode[]> {
    return this.request<KnowledgeNode[]>('/knowledge/libraries');
  }

  async getAllDomains(): Promise<KnowledgeNode[]> {
    return this.request<KnowledgeNode[]>('/knowledge/domains');
  }

  async getAllPoints(): Promise<KnowledgeNode[]> {
    return this.request<KnowledgeNode[]>('/knowledge/points');
  }

  async getKnowledgeNodeById(id: number): Promise<KnowledgeNode> {
    return this.request<KnowledgeNode>(`/knowledge/${id}`);
  }

  async getChildrenByParentId(parentId: number): Promise<KnowledgeNode[]> {
    return this.request<KnowledgeNode[]>(`/knowledge/children/${parentId}`);
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.request<Question[]>('/questions');
  }

  async getQuestionById(id: number): Promise<Question> {
    return this.request<Question>(`/questions/${id}`);
  }

  async getQuestionsByKnowledgePointId(knowledgePointId: number): Promise<Question[]> {
    return this.request<Question[]>(`/questions/knowledge-point/${knowledgePointId}`);
  }

  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    return this.request<Question[]>(`/questions/difficulty/${difficulty}`);
  }

  async getQuestionsByType(type: string): Promise<Question[]> {
    return this.request<Question[]>(`/questions/type/${type}`);
  }

  async getQuestionsByTag(tag: string): Promise<Question[]> {
    return this.request<Question[]>(`/questions/tag/${tag}`);
  }

  async createQuestion(question: Partial<Question>): Promise<Question> {
    return this.request<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  async updateQuestion(id: number, question: Partial<Question>): Promise<Question> {
    return this.request<Question>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
  }

  async deleteQuestion(id: number): Promise<void> {
    return this.request<void>(`/questions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
