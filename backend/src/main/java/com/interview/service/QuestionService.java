package com.interview.service;

import com.interview.entity.Question;
import com.interview.entity.QuestionOption;
import com.interview.repository.QuestionRepository;
import com.interview.repository.QuestionOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAllOrderById();
    }

    public Question getById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    public List<Question> getByKnowledgePointId(Long knowledgePointId) {
        return questionRepository.findByKnowledgePointId(knowledgePointId);
    }

    public List<Question> getByDifficulty(String difficulty) {
        return questionRepository.findByDifficulty(difficulty);
    }

    public List<Question> getByType(String type) {
        return questionRepository.findByType(type);
    }

    public List<Question> getByTag(String tag) {
        return questionRepository.findByTagsContaining(tag);
    }

    @Transactional
    public Question save(Question question, List<QuestionOption> options) {
        Question savedQuestion = questionRepository.save(question);

        if (options != null && !options.isEmpty()) {
            options.forEach(option -> option.setQuestionId(savedQuestion.getId()));
            questionOptionRepository.saveAll(options);
        }

        return savedQuestion;
    }

    @Transactional
    public void delete(Long id) {
        questionOptionRepository.deleteByQuestionId(id);
        questionRepository.deleteById(id);
    }

    @Transactional
    public List<Question> saveAll(List<Question> questions) {
        return questionRepository.saveAll(questions);
    }

    public List<QuestionOption> getOptionsByQuestionId(Long questionId) {
        return questionOptionRepository.findByQuestionId(questionId);
    }
}
