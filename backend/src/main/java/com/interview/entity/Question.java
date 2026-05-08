package com.interview.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "knowledge_point_id", nullable = false)
    private Long knowledgePointId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "questionId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @Column(name = "analysis", columnDefinition = "TEXT")
    private String analysis;

    @Column(name = "difficulty", length = 20)
    private String difficulty;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
