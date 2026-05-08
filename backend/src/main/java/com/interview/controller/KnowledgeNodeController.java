package com.interview.controller;

import com.interview.entity.KnowledgeNode;
import com.interview.service.KnowledgeNodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/knowledge")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KnowledgeNodeController {

    private final KnowledgeNodeService knowledgeNodeService;

    @GetMapping("/tree")
    public ResponseEntity<List<KnowledgeNode>> getKnowledgeTree() {
        List<KnowledgeNode> libraries = knowledgeNodeService.getAllLibraries();

        for (KnowledgeNode library : libraries) {
            loadChildren(library);
        }

        return ResponseEntity.ok(libraries);
    }

    private void loadChildren(KnowledgeNode node) {
        List<KnowledgeNode> children = knowledgeNodeService.getChildrenByParentId(node.getId());
        node.setChildren(children);

        for (KnowledgeNode child : children) {
            if (child.getChildren() != null && !child.getChildren().isEmpty()) {
                loadChildren(child);
            } else {
                List<KnowledgeNode> grandChildren = knowledgeNodeService.getChildrenByParentId(child.getId());
                child.setChildren(grandChildren);

                for (KnowledgeNode grandChild : grandChildren) {
                    loadChildren(grandChild);
                }
            }
        }
    }

    @GetMapping("/libraries")
    public ResponseEntity<List<KnowledgeNode>> getAllLibraries() {
        return ResponseEntity.ok(knowledgeNodeService.getAllLibraries());
    }

    @GetMapping("/domains")
    public ResponseEntity<List<KnowledgeNode>> getAllDomains() {
        return ResponseEntity.ok(knowledgeNodeService.getAllDomains());
    }

    @GetMapping("/points")
    public ResponseEntity<List<KnowledgeNode>> getAllPoints() {
        return ResponseEntity.ok(knowledgeNodeService.getAllPoints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeNode> getById(@PathVariable Long id) {
        KnowledgeNode node = knowledgeNodeService.getById(id);
        if (node == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(node);
    }

    @GetMapping("/children/{parentId}")
    public ResponseEntity<List<KnowledgeNode>> getChildren(@PathVariable Long parentId) {
        return ResponseEntity.ok(knowledgeNodeService.getChildrenByParentId(parentId));
    }

    @PostMapping
    public ResponseEntity<KnowledgeNode> create(@RequestBody KnowledgeNode node) {
        KnowledgeNode saved = knowledgeNodeService.save(node);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeNode> update(@PathVariable Long id, @RequestBody KnowledgeNode node) {
        KnowledgeNode existing = knowledgeNodeService.getById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        existing.setName(node.getName());
        existing.setDescription(node.getDescription());
        existing.setColor(node.getColor());
        existing.setQuestionCount(node.getQuestionCount());
        existing.setMasteryRate(node.getMasteryRate());

        KnowledgeNode updated = knowledgeNodeService.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        knowledgeNodeService.delete(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "删除成功");
        return ResponseEntity.ok(response);
    }
}
