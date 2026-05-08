package com.interview.repository;

import com.interview.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByKnowledgePointId(Long knowledgePointId);

    List<Question> findByDifficulty(String difficulty);

    List<Question> findByType(String type);

    @Query("SELECT q FROM Question q WHERE q.tags LIKE %?1%")
    List<Question> findByTagsContaining(String tag);

    @Query("SELECT q FROM Question q ORDER BY q.id")
    List<Question> findAllOrderById();
}
