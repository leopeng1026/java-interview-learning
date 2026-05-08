-- Database initialization script for interview_db

CREATE DATABASE IF NOT EXISTS interview_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE interview_db;

-- Create tables if they don't exist (for manual setup)
CREATE TABLE IF NOT EXISTS knowledge_node (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20),
    description TEXT,
    color VARCHAR(20),
    question_count INT DEFAULT 0,
    mastery_rate DOUBLE DEFAULT 0.0,
    parent_id BIGINT,
    library_id BIGINT,
    domain_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS question (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_point_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    answer TEXT,
    analysis TEXT,
    difficulty VARCHAR(20),
    type VARCHAR(50),
    tags VARCHAR(500),
    source VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_knowledge_point_id (knowledge_point_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS question_option (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    option_key VARCHAR(5),
    option_value TEXT,
    INDEX idx_question_id (question_id),
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
