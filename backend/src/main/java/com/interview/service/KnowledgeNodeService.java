package com.interview.service;

import com.interview.entity.KnowledgeNode;
import com.interview.repository.KnowledgeNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KnowledgeNodeService {

    private final KnowledgeNodeRepository knowledgeNodeRepository;

    public List<KnowledgeNode> getAllLibraries() {
        return knowledgeNodeRepository.findAllLibraries();
    }

    public List<KnowledgeNode> getAllDomains() {
        return knowledgeNodeRepository.findAllDomains();
    }

    public List<KnowledgeNode> getAllPoints() {
        return knowledgeNodeRepository.findAllPoints();
    }

    public List<KnowledgeNode> getChildrenByParentId(Long parentId) {
        return knowledgeNodeRepository.findByParentId(parentId);
    }

    public KnowledgeNode getById(Long id) {
        return knowledgeNodeRepository.findById(id).orElse(null);
    }

    @Transactional
    public KnowledgeNode save(KnowledgeNode node) {
        return knowledgeNodeRepository.save(node);
    }

    @Transactional
    public void delete(Long id) {
        knowledgeNodeRepository.deleteById(id);
    }

    @Transactional
    public List<KnowledgeNode> saveAll(List<KnowledgeNode> nodes) {
        return knowledgeNodeRepository.saveAll(nodes);
    }

    public List<KnowledgeNode> findByType(String type) {
        return knowledgeNodeRepository.findByType(type);
    }
}
