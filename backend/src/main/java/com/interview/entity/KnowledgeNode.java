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
@Table(name = "knowledge_node")
public class KnowledgeNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 20)
    private String color;

    @Column(name = "question_count")
    private Integer questionCount = 0;

    @Column(name = "mastery_rate")
    private Double masteryRate = 0.0;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "library_id")
    private Long libraryId;

    @Column(name = "domain_id")
    private Long domainId;

    @OneToMany(mappedBy = "parentId", cascade = CascadeType.ALL)
    private List<KnowledgeNode> children;

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
