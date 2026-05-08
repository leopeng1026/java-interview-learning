package com.interview.controller;

import com.interview.entity.Question;
import com.interview.entity.QuestionOption;
import com.interview.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();

        for (Question question : questions) {
            List<QuestionOption> options = questionService.getOptionsByQuestionId(question.getId());
            question.setOptions(options);
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        Question question = questionService.getById(id);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        List<QuestionOption> options = questionService.getOptionsByQuestionId(id);
        question.setOptions(options);

        Map<String, Object> response = new HashMap<>();
        response.put("question", question);
        response.put("options", options);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/knowledge-point/{knowledgePointId}")
    public ResponseEntity<List<Question>> getByKnowledgePointId(@PathVariable Long knowledgePointId) {
        List<Question> questions = questionService.getByKnowledgePointId(knowledgePointId);

        for (Question question : questions) {
            List<QuestionOption> options = questionService.getOptionsByQuestionId(question.getId());
            question.setOptions(options);
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Question>> getByDifficulty(@PathVariable String difficulty) {
        List<Question> questions = questionService.getByDifficulty(difficulty);

        for (Question question : questions) {
            List<QuestionOption> options = questionService.getOptionsByQuestionId(question.getId());
            question.setOptions(options);
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Question>> getByType(@PathVariable String type) {
        List<Question> questions = questionService.getByType(type);

        for (Question question : questions) {
            List<QuestionOption> options = questionService.getOptionsByQuestionId(question.getId());
            question.setOptions(options);
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Question>> getByTag(@PathVariable String tag) {
        List<Question> questions = questionService.getByTag(tag);

        for (Question question : questions) {
            List<QuestionOption> options = questionService.getOptionsByQuestionId(question.getId());
            question.setOptions(options);
        }

        return ResponseEntity.ok(questions);
    }

    @PostMapping
    public ResponseEntity<Question> create(@RequestBody Map<String, Object> request) {
        Question question = convertToQuestion(request);
        List<QuestionOption> options = convertToOptions(request);

        Question saved = questionService.save(question, options);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> update(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Question existing = questionService.getById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        Question question = convertToQuestion(request);
        question.setId(id);
        List<QuestionOption> options = convertToOptions(request);

        Question updated = questionService.save(question, options);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        questionService.delete(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "删除成功");
        return ResponseEntity.ok(response);
    }

    @SuppressWarnings("unchecked")
    private Question convertToQuestion(Map<String, Object> request) {
        Question question = new Question();

        if (request.containsKey("id")) {
            question.setId(Long.valueOf(request.get("id").toString()));
        }

        question.setKnowledgePointId(Long.valueOf(request.get("knowledgePointId").toString()));
        question.setContent((String) request.get("content"));
        question.setAnswer((String) request.get("answer"));
        question.setAnalysis((String) request.get("analysis"));
        question.setDifficulty((String) request.get("difficulty"));
        question.setType((String) request.get("type"));
        question.setTags((String) request.get("tags"));
        question.setSource((String) request.get("source"));

        return question;
    }

    @SuppressWarnings("unchecked")
    private List<QuestionOption> convertToOptions(Map<String, Object> request) {
        List<Map<String, Object>> optionsData = (List<Map<String, Object>>) request.get("options");

        if (optionsData == null || optionsData.isEmpty()) {
            return List.of();
        }

        return optionsData.stream().map(opt -> {
            QuestionOption option = new QuestionOption();
            option.setOptionKey((String) opt.get("key"));
            option.setOptionValue((String) opt.get("value"));
            return option;
        }).toList();
    }
}
