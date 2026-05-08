package com.interview.repository;

import com.interview.entity.KnowledgeNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeNodeRepository extends JpaRepository<KnowledgeNode, Long> {

    List<KnowledgeNode> findByParentIdIsNull();

    List<KnowledgeNode> findByParentId(Long parentId);

    List<KnowledgeNode> findByType(String type);

    @Query("SELECT k FROM KnowledgeNode k WHERE k.parentId IS NULL ORDER BY k.id")
    List<KnowledgeNode> findAllLibraries();

    @Query("SELECT k FROM KnowledgeNode k WHERE k.parentId IS NOT NULL AND k.type = 'domain' ORDER BY k.id")
    List<KnowledgeNode> findAllDomains();

    @Query("SELECT k FROM KnowledgeNode k WHERE k.type = 'point' ORDER BY k.id")
    List<KnowledgeNode> findAllPoints();
}
