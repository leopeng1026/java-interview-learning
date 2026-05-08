-- ============================================
-- Java Interview Question Bank - Database Setup
-- ============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS interview_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE interview_db;

-- ============================================
-- Table: knowledge_node (知识节点表)
-- ============================================
DROP TABLE IF EXISTS knowledge_node;
CREATE TABLE knowledge_node (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '节点名称',
    type VARCHAR(20) COMMENT '节点类型: library(库), domain(领域), point(知识点)',
    description TEXT COMMENT '描述',
    color VARCHAR(20) COMMENT '颜色标识',
    question_count INT DEFAULT 0 COMMENT '题目数量',
    mastery_rate DOUBLE DEFAULT 0.0 COMMENT '掌握率',
    parent_id BIGINT COMMENT '父节点ID',
    library_id BIGINT COMMENT '所属库ID',
    domain_id BIGINT COMMENT '所属领域ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识节点表';

-- ============================================
-- Table: question (题目表)
-- ============================================
DROP TABLE IF EXISTS question;
CREATE TABLE question (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_point_id BIGINT NOT NULL COMMENT '所属知识点ID',
    content TEXT NOT NULL COMMENT '题目内容',
    answer TEXT COMMENT '答案',
    analysis TEXT COMMENT '解析',
    difficulty VARCHAR(20) COMMENT '难度: easy, medium, hard',
    type VARCHAR(50) COMMENT '题型: single_choice, multiple_choice',
    tags VARCHAR(500) COMMENT '标签，逗号分隔',
    source VARCHAR(100) COMMENT '来源',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_knowledge_point_id (knowledge_point_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

-- ============================================
-- Table: question_option (题目选项表)
-- ============================================
DROP TABLE IF EXISTS question_option;
CREATE TABLE question_option (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL COMMENT '所属题目ID',
    option_key VARCHAR(5) COMMENT '选项标识: A, B, C, D...',
    option_value TEXT COMMENT '选项内容',
    INDEX idx_question_id (question_id),
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目选项表';

-- ============================================
-- Insert knowledge nodes (知识节点数据)
-- ============================================

-- Libraries (知识库)
INSERT INTO knowledge_node (id, name, type, description, color, question_count, mastery_rate, parent_id, library_id, domain_id) VALUES
(1, 'Java基础', 'library', 'Java语言核心基础知识', '#1e3a5f', 150, 0.65, NULL, NULL, NULL),
(2, 'Spring框架', 'library', 'Spring生态核心技术', '#4caf50', 80, 0.48, NULL, NULL, NULL),
(3, '数据库', 'library', 'MySQL数据库核心技术', '#f5a623', 70, 0.55, NULL, NULL, NULL);

-- Domains (领域)
INSERT INTO knowledge_node (id, name, type, description, question_count, mastery_rate, parent_id, library_id, domain_id) VALUES
(11, '集合框架', 'domain', 'Java集合框架核心原理', 45, 0.72, 1, 1, NULL),
(12, 'JVM虚拟机', 'domain', 'JVM原理与调优', 55, 0.58, 1, 1, NULL),
(13, '多线程与并发', 'domain', 'Java并发编程', 50, 0.52, 1, 1, NULL),
(21, 'IoC容器', 'domain', 'Spring核心容器', 30, 0.55, 2, 2, NULL),
(22, 'AOP面向切面编程', 'domain', 'AOP核心概念与应用', 25, 0.42, 2, 2, NULL),
(23, 'Spring事务', 'domain', '事务管理与传播行为', 25, 0.38, 2, 2, NULL),
(31, '索引与存储', 'domain', 'MySQL索引原理与优化', 30, 0.6, 3, 3, NULL),
(32, '事务与锁', 'domain', '事务隔离与锁机制', 40, 0.5, 3, 3, NULL);

-- Points (知识点)
INSERT INTO knowledge_node (id, name, type, description, question_count, mastery_rate, parent_id, library_id, domain_id) VALUES
(111, 'ArrayList原理与源码', 'point', '深入理解ArrayList的底层实现、扩容机制、线程安全性', 12, 0.8, 11, 1, 1),
(112, 'HashMap原理与源码', 'point', 'JDK 8中的HashMap实现原理、哈希冲突处理、扩容机制', 18, 0.65, 11, 1, 1),
(113, 'ConcurrentHashMap', 'point', '并发场景下的Map实现，JDK 7与JDK 8的区别', 15, 0.45, 11, 1, 1),
(121, '内存结构', 'point', '堆、栈、方法区等内存区域的划分与作用', 20, 0.7, 12, 1, 1),
(122, '垃圾回收', 'point', 'GC算法、垃圾收集器的工作原理', 25, 0.5, 12, 1, 1),
(123, '类加载机制', 'point', '类加载器、双亲委派模型、类加载过程', 10, 0.55, 12, 1, 1),
(131, 'synchronized', 'point', 'Synchronized的底层实现、锁升级过程', 15, 0.6, 13, 1, 1),
(132, 'volatile与内存屏障', 'point', 'Volatile的可见性保证、指令重排原理', 12, 0.48, 13, 1, 1),
(133, '线程池原理', 'point', '线程池参数、拒绝策略、工作流程', 18, 0.4, 13, 1, 1),
(134, 'AQS与ReentrantLock', 'point', '抽象队列同步器的实现原理', 5, 0.35, 13, 1, 1),
(211, '依赖注入原理', 'point', 'Spring如何实现依赖注入、bean的生命周期', 18, 0.6, 21, 2, 2),
(212, 'Bean作用域', 'point', 'Singleton、Prototype等作用域的区别', 12, 0.5, 21, 2, 2),
(221, 'AOP核心概念', 'point', '切面、通知、切点、连接点的理解', 15, 0.45, 22, 2, 2),
(222, 'JDK与CGLIB动态代理', 'point', '两种代理方式的区别与选择', 10, 0.4, 22, 2, 2),
(231, '事务传播行为', 'point', '7种事务传播行为的区别与应用场景', 15, 0.35, 23, 2, 2),
(232, '事务隔离级别', 'point', '数据库事务隔离级别与Spring事务管理', 10, 0.42, 23, 2, 2),
(311, 'B+树索引原理', 'point', 'B+树的结构特点、聚簇索引与非聚簇索引', 18, 0.55, 31, 3, 3),
(312, '索引优化', 'point', '索引失效场景、最左前缀原则、覆盖索引', 12, 0.65, 31, 3, 3),
(321, '事务隔离级别', 'point', '脏读、不可重复读、幻读的原理与解决', 15, 0.52, 32, 3, 3),
(322, 'MVCC机制', 'point', '多版本并发控制的实现原理', 12, 0.4, 32, 3, 3),
(323, '锁机制', 'point', '行锁、表锁、间隙锁、临键锁', 13, 0.48, 32, 3, 3);

-- ============================================
-- Insert questions (题目数据)
-- ============================================

-- Question 1: HashMap原理
INSERT INTO question (id, knowledge_point_id, content, answer, analysis, difficulty, type, tags, source) VALUES
(1, 112, 
 '关于HashMap在JDK 8中的实现，以下说法错误的是？',
 'B,D',
 '这道题考察HashMap的原理知识。正确答案：B、D。详细解析：B选项错误原因：HashMap在JDK 8中进行了优化，扩容时不需要重新计算所有键值对的哈希码。新位置 = (e.hash & oldCap) == 0 ? oldIndex : oldIndex + oldCap，只需要判断哈希码的最高位（第N位）。如果为0，位置不变；如果为1，位置增加oldCap。相比JDK 7的rehash（重新计算哈希），性能提升明显。D选项错误原因：HashMap允许一个null键和多个null值，这是HashMap与Hashtable的主要区别。A选项正确：TREEIFY_THRESHOLD = 8，当链表长度超过8且数组长度>=64时，会树化为红黑树。C选项正确：tableSizeFor()方法通过位移运算，确保容量为2的幂次方，便于通过&运算替代%取模，提升计算效率。',
 'medium', 'multiple_choice', 'jdk8,扩容机制,红黑树,哈希冲突', '2024美团校招');

-- Question 2: HashMap负载因子
INSERT INTO question (id, knowledge_point_id, content, answer, analysis, difficulty, type, tags, source) VALUES
(2, 112,
 'HashMap的负载因子默认是多少？为什么要选择0.75作为默认值？',
 'B',
 '这道题考察HashMap负载因子的设计考量。HashMap负载因子默认为0.75的原因：1. 空间与时间的平衡：负载因子越小，hash冲突概率越低，但空间利用率低；负载因子越大，空间利用率高，但hash冲突概率增大。2. 泊松分布分析：JDK团队经过统计分析，链表长度超过8的概率已经非常低（<0.0000006）。3. 数学证明：根据泊松分布，负载因子0.75时，链表长度分布合理。4. 扩容性能：0.75使得扩容时机合理，扩容后元素会重新分布，但平均查找成本保持在O(1)附近。',
 'easy', 'single_choice', '负载因子,扩容,性能优化', '2024字节跳动校招');

-- Question 3: HashMap并发问题
INSERT INTO question (id, knowledge_point_id, content, answer, analysis, difficulty, type, tags, source) VALUES
(3, 112,
 'HashMap在并发环境下可能出现哪些问题？',
 'D',
 '这道题考察HashMap的并发安全问题。正确答案：D。详细解析：1. 死循环问题（JDK 7及以前）：JDK 7使用头插法进行扩容，在高并发下可能导致环形链表。当get()操作访问该位置时，进入死循环。JDK 8已改为尾插法，解决了死循环问题，但仍存在数据错乱风险。2. 数据覆盖问题：并发put()时，由于缺乏同步控制，可能发生数据覆盖。3. size()不准确问题：modCount在并发环境下可能不准确。并发场景解决方案：推荐使用ConcurrentHashMap。',
 'medium', 'single_choice', '并发,线程安全,扩容', '2024阿里校招');

-- Question 4: ConcurrentHashMap
INSERT INTO question (id, knowledge_point_id, content, answer, analysis, difficulty, type, tags, source) VALUES
(4, 113,
 '关于ConcurrentHashMap在JDK 8中的改进，以下说法正确的是？',
 'A,C,D',
 '这道题考察ConcurrentHashMap的JDK 7与JDK 8实现差异。正确答案：A、C、D。JDK 7使用Segment数组，每个Segment继承ReentrantLock，默认16个Segment，支持16并发，锁的粒度较大。JDK 8移除了Segment，使用Node数组 + CAS + synchronized，锁的粒度更细，只锁住当前桶的头节点，并发度更高（理论上可达到数组长度）。插入数据的三种情况：1. table[i] == null时使用CAS操作；2. table[i] != null && hash != MOVED(-1)时使用synchronized锁住table[i]；3. hash == MOVED(-1)时协助扩容（helpTransfer）。',
 'hard', 'multiple_choice', 'JDK8,CAS,synchronized,并发', '2024腾讯校招');

-- Question 5: synchronized锁升级
INSERT INTO question (id, knowledge_point_id, content, answer, analysis, difficulty, type, tags, source) VALUES
(5, 131,
 'synchronized锁升级的过程是什么？',
 'A',
 '这道题考察synchronized的锁升级机制（JDK 6引入的优化）。正确答案：A。synchronized锁升级是不可逆的过程：1. 偏向锁：适用于只有一个线程访问同步代码块的场景，在对象头的Mark Word中存储线程ID，首次CAS后无需同步操作。2. 轻量级锁：适用于多个线程交替访问同步代码块的场景（无竞争），在线程栈帧中创建Lock Record，CAS修改Mark Word。3. 重量级锁：适用于存在真正竞争的场景，依赖操作系统Mutex Lock，用户态到内核态的切换开销大。升级过程：无锁 → 偏向锁 → 轻量级锁 → 重量级锁。',
 'medium', 'single_choice', '锁升级,锁优化,Mark Word', '2024字节跳动校招');

-- Question 6: CMS与G1收集器
INSERT INTO question (id, knowledge_point_id, content, answer, analysis, difficulty, type, tags, source) VALUES
(6, 122,
 '关于CMS收集器和G1收集器的区别，以下说法正确的是？',
 'A,B,D',
 '这道题考察JVM垃圾收集器的核心区别。正确答案：A、B、D。CMS收集器使用标记-清除算法，会产生内存碎片，四阶段包括初始标记（STW）、并发标记、重新标记（STW）、并发清除。缺点：无法处理浮动垃圾、产生内存碎片、对CPU敏感。G1收集器创新设计Region，将堆划分为多个大小相等的Region（1MB~32MB），每个Region可以独立作为Eden、Survivor、Old区，解决了内存碎片问题。可以设置期望停顿时间（-XX:MaxGCPauseMillis）。C选项错误原因：CMS不适用于大堆场景，G1更适合大堆（>6GB）和需要可控延迟的场景。JDK 9+建议：G1已成为默认垃圾收集器。',
 'hard', 'multiple_choice', 'CMS,G1,垃圾收集器,算法', '2024京东校招');

-- ============================================
-- Insert question options (题目选项数据)
-- ============================================

-- Options for Question 1
INSERT INTO question_option (question_id, option_key, option_value) VALUES
(1, 'A', '当链表长度超过8时，链表会转化为红黑树'),
(1, 'B', '扩容时需要重新计算所有键值对的哈希码'),
(1, 'C', '使用tableSizeFor()方法确保容量为2的幂次方'),
(1, 'D', 'key可以为null，但value不能为null');

-- Options for Question 2
INSERT INTO question_option (question_id, option_key, option_value) VALUES
(2, 'A', '0.5，空间与时间的平衡'),
(2, 'B', '0.75，空间与时间的平衡'),
(2, 'C', '0.8，时间效率优先'),
(2, 'D', '1.0，空间效率优先');

-- Options for Question 3
INSERT INTO question_option (question_id, option_key, option_value) VALUES
(3, 'A', '死循环（JDK 7及以前）'),
(3, 'B', '数据覆盖导致数据丢失'),
(3, 'C', 'size()方法返回值不准确'),
(3, 'D', '以上皆是');

-- Options for Question 4
INSERT INTO question_option (question_id, option_key, option_value) VALUES
(4, 'A', '移除了Segment，使用CAS + synchronized'),
(4, 'B', '仍然使用Segment分段锁'),
(4, 'C', '头节点为null时使用CAS插入'),
(4, 'D', '头节点不为null时使用synchronized锁住头节点');

-- Options for Question 5
INSERT INTO question_option (question_id, option_key, option_value) VALUES
(5, 'A', '偏向锁 → 轻量级锁 → 重量级锁'),
(5, 'B', '轻量级锁 → 偏向锁 → 重量级锁'),
(5, 'C', '重量级锁 → 轻量级锁 → 偏向锁'),
(5, 'D', '无锁 → 偏向锁 → 轻量级锁 → 重量级锁');

-- Options for Question 6
INSERT INTO question_option (question_id, option_key, option_value) VALUES
(6, 'A', 'CMS使用标记-清除算法，G1使用标记-整理算法'),
(6, 'B', 'G1将堆划分为多个大小相等的Region'),
(6, 'C', 'CMS适用于大堆场景，G1适用于大堆和低延迟场景'),
(6, 'D', 'G1可以设置期望的停顿时间');

-- ============================================
-- Final adjustments
-- ============================================
COMMIT;

SELECT 'Database setup completed successfully!' AS message;
SELECT COUNT(*) AS knowledge_node_count FROM knowledge_node;
SELECT COUNT(*) AS question_count FROM question;
SELECT COUNT(*) AS option_count FROM question_option;
