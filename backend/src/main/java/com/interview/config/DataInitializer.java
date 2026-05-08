package com.interview.config;

import com.interview.entity.KnowledgeNode;
import com.interview.entity.Question;
import com.interview.entity.QuestionOption;
import com.interview.repository.KnowledgeNodeRepository;
import com.interview.repository.QuestionRepository;
import com.interview.repository.QuestionOptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final KnowledgeNodeRepository knowledgeNodeRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;

    @Override
    public void run(String... args) {
        if (knowledgeNodeRepository.count() == 0) {
            log.info("Initializing knowledge nodes and questions...");
            initializeKnowledgeNodes();
            initializeQuestions();
            log.info("Data initialization completed!");
        } else {
            log.info("Data already exists, skipping initialization");
        }
    }

    private void initializeKnowledgeNodes() {
        List<KnowledgeNode> nodes = Arrays.asList(
            createNode(1L, "Java基础", "library", "Java语言核心基础知识", "#1e3a5f", 150, 0.65, null, null, null),
            createNode(2L, "Spring框架", "library", "Spring生态核心技术", "#4caf50", 80, 0.48, null, null, null),
            createNode(3L, "数据库", "library", "MySQL数据库核心技术", "#f5a623", 70, 0.55, null, null, null),

            createNode(11L, "集合框架", "domain", "Java集合框架核心原理", null, 45, 0.72, 1L, 1L, null),
            createNode(12L, "JVM虚拟机", "domain", "JVM原理与调优", null, 55, 0.58, 1L, 1L, null),
            createNode(13L, "多线程与并发", "domain", "Java并发编程", null, 50, 0.52, 1L, 1L, null),

            createNode(21L, "IoC容器", "domain", "Spring核心容器", null, 30, 0.55, 2L, 2L, null),
            createNode(22L, "AOP面向切面编程", "domain", "AOP核心概念与应用", null, 25, 0.42, 2L, 2L, null),
            createNode(23L, "Spring事务", "domain", "事务管理与传播行为", null, 25, 0.38, 2L, 2L, null),

            createNode(31L, "索引与存储", "domain", "MySQL索引原理与优化", null, 30, 0.6, 3L, 3L, null),
            createNode(32L, "事务与锁", "domain", "事务隔离与锁机制", null, 40, 0.5, 3L, 3L, null),

            createNode(111L, "ArrayList原理与源码", "point", "深入理解ArrayList的底层实现", null, 12, 0.8, 11L, 1L, 1L),
            createNode(112L, "HashMap原理与源码", "point", "JDK 8中的HashMap实现原理", null, 18, 0.65, 11L, 1L, 1L),
            createNode(113L, "ConcurrentHashMap", "point", "并发场景下的Map实现", null, 15, 0.45, 11L, 1L, 1L),

            createNode(121L, "内存结构", "point", "堆、栈、方法区等内存区域", null, 20, 0.7, 12L, 1L, 1L),
            createNode(122L, "垃圾回收", "point", "GC算法与垃圾收集器", null, 25, 0.5, 12L, 1L, 1L),
            createNode(123L, "类加载机制", "point", "类加载器与双亲委派", null, 10, 0.55, 12L, 1L, 1L),

            createNode(131L, "synchronized", "point", "Synchronized的底层实现", null, 15, 0.6, 13L, 1L, 1L),
            createNode(132L, "volatile与内存屏障", "point", "Volatile的可见性保证", null, 12, 0.48, 13L, 1L, 1L),
            createNode(133L, "线程池原理", "point", "线程池参数与工作流程", null, 18, 0.4, 13L, 1L, 1L),
            createNode(134L, "AQS与ReentrantLock", "point", "抽象队列同步器的实现", null, 5, 0.35, 13L, 1L, 1L),

            createNode(211L, "依赖注入原理", "point", "Spring如何实现依赖注入", null, 18, 0.6, 21L, 2L, 2L),
            createNode(212L, "Bean作用域", "point", "Singleton、Prototype等作用域", null, 12, 0.5, 21L, 2L, 2L),

            createNode(221L, "AOP核心概念", "point", "切面、通知、切点、连接点", null, 15, 0.45, 22L, 2L, 2L),
            createNode(222L, "JDK与CGLIB动态代理", "point", "两种代理方式的区别", null, 10, 0.4, 22L, 2L, 2L),

            createNode(231L, "事务传播行为", "point", "7种事务传播行为", null, 15, 0.35, 23L, 2L, 2L),
            createNode(232L, "事务隔离级别", "point", "数据库事务隔离级别", null, 10, 0.42, 23L, 2L, 2L),

            createNode(311L, "B+树索引原理", "point", "B+树的结构与聚簇索引", null, 18, 0.55, 31L, 3L, 3L),
            createNode(312L, "索引优化", "point", "索引失效与最左前缀", null, 12, 0.65, 31L, 3L, 3L),

            createNode(321L, "事务隔离级别", "point", "脏读、不可重复读、幻读", null, 15, 0.52, 32L, 3L, 3L),
            createNode(322L, "MVCC机制", "point", "多版本并发控制", null, 12, 0.4, 32L, 3L, 3L),
            createNode(323L, "锁机制", "point", "行锁、表锁、间隙锁", null, 13, 0.48, 32L, 3L, 3L)
        );

        knowledgeNodeRepository.saveAll(nodes);
        log.info("Initialized {} knowledge nodes", nodes.size());
    }

    private KnowledgeNode createNode(Long id, String name, String type, String description,
                                     String color, int questionCount, double masteryRate,
                                     Long parentId, Long libraryId, Long domainId) {
        KnowledgeNode node = new KnowledgeNode();
        node.setId(id);
        node.setName(name);
        node.setType(type);
        node.setDescription(description);
        node.setColor(color);
        node.setQuestionCount(questionCount);
        node.setMasteryRate(masteryRate);
        node.setParentId(parentId);
        node.setLibraryId(libraryId);
        node.setDomainId(domainId);
        return node;
    }

    private void initializeQuestions() {
        Question q1 = createQuestion(1L, 112L,
            "关于HashMap在JDK 8中的实现，以下说法错误的是？",
            "B,D",
            "这道题考察HashMap的原理知识。正确答案：B、D。详细解析：B选项错误原因：HashMap在JDK 8中进行了优化，扩容时不需要重新计算所有键值对的哈希码。新位置 = (e.hash & oldCap) == 0 ? oldIndex : oldIndex + oldCap，只需要判断哈希码的最高位。D选项错误原因：HashMap允许一个null键和多个null值，这是HashMap与Hashtable的主要区别。",
            "medium", "multiple_choice", "jdk8,扩容机制,红黑树,哈希冲突", "2024美团校招");

        Question q2 = createQuestion(2L, 112L,
            "HashMap的负载因子默认是多少？为什么要选择0.75作为默认值？",
            "B",
            "这道题考察HashMap负载因子的设计考量。HashMap负载因子默认为0.75的原因：1. 空间与时间的平衡；2. 泊松分布分析，JDK团队经过统计分析，链表长度超过8的概率已经非常低；3. 0.75是一个临界点，既保证了较好的空间利用率，又控制了hash冲突。",
            "easy", "single_choice", "负载因子,扩容,性能优化", "2024字节跳动校招");

        Question q3 = createQuestion(3L, 112L,
            "HashMap在并发环境下可能出现哪些问题？",
            "D",
            "这道题考察HashMap的并发安全问题。正确答案：D。详细解析：1. 死循环问题（JDK 7及以前），JDK 7使用头插法可能导致环形链表；2. 数据覆盖问题，并发put时可能发生数据覆盖；3. size()不准确问题，modCount在并发环境下可能不准确。并发场景解决方案：推荐使用ConcurrentHashMap。",
            "medium", "single_choice", "并发,线程安全,扩容", "2024阿里校招");

        Question q4 = createQuestion(4L, 113L,
            "关于ConcurrentHashMap在JDK 8中的改进，以下说法正确的是？",
            "A,C,D",
            "这道题考察ConcurrentHashMap的JDK 7与JDK 8实现差异。正确答案：A、C、D。JDK 8移除了Segment，使用CAS + synchronized，锁的粒度更细。插入数据的三种情况：1. table[i] == null时使用CAS操作；2. table[i] != null时使用synchronized锁住头节点；3. hash == MOVED(-1)时协助扩容。",
            "hard", "multiple_choice", "JDK8,CAS,synchronized,并发", "2024腾讯校招");

        Question q5 = createQuestion(5L, 131L,
            "synchronized锁升级的过程是什么？",
            "A",
            "这道题考察synchronized的锁升级机制（JDK 6引入的优化）。正确答案：A。synchronized锁升级是不可逆的过程：1. 偏向锁，适用于只有一个线程访问同步代码块的场景；2. 轻量级锁，适用于多个线程交替访问同步代码块的场景；3. 重量级锁，适用于存在真正竞争的场景。为什么不可逆？已升级的锁不会再降级，以节省资源和简化实现。",
            "medium", "single_choice", "锁升级,锁优化,Mark Word", "2024字节跳动校招");

        Question q6 = createQuestion(6L, 122L,
            "关于CMS收集器和G1收集器的区别，以下说法正确的是？",
            "A,B,D",
            "这道题考察JVM垃圾收集器的核心区别。正确答案：A、B、D。CMS使用标记-清除算法，会产生内存碎片。G1将堆划分为多个大小相等的Region，可以设置期望的停顿时间。C选项错误原因：CMS不适用于大堆场景，G1更适合大堆（>6GB）和需要可控延迟的场景。JDK 9+建议：G1已成为默认垃圾收集器。",
            "hard", "multiple_choice", "CMS,G1,垃圾收集器,算法", "2024京东校招");

        List<Question> questions = Arrays.asList(q1, q2, q3, q4, q5, q6);
        questionRepository.saveAll(questions);

        initializeQuestionOptions(q1.getId(), Arrays.asList(
            createOption(null, "A", "当链表长度超过8时，链表会转化为红黑树"),
            createOption(null, "B", "扩容时需要重新计算所有键值对的哈希码"),
            createOption(null, "C", "使用tableSizeFor()方法确保容量为2的幂次方"),
            createOption(null, "D", "key可以为null，但value不能为null")
        ));

        initializeQuestionOptions(q2.getId(), Arrays.asList(
            createOption(null, "A", "0.5，空间与时间的平衡"),
            createOption(null, "B", "0.75，空间与时间的平衡"),
            createOption(null, "C", "0.8，时间效率优先"),
            createOption(null, "D", "1.0，空间效率优先")
        ));

        initializeQuestionOptions(q3.getId(), Arrays.asList(
            createOption(null, "A", "死循环（JDK 7及以前）"),
            createOption(null, "B", "数据覆盖导致数据丢失"),
            createOption(null, "C", "size()方法返回值不准确"),
            createOption(null, "D", "以上皆是")
        ));

        initializeQuestionOptions(q4.getId(), Arrays.asList(
            createOption(null, "A", "移除了Segment，使用CAS + synchronized"),
            createOption(null, "B", "仍然使用Segment分段锁"),
            createOption(null, "C", "头节点为null时使用CAS插入"),
            createOption(null, "D", "头节点不为null时使用synchronized锁住头节点")
        ));

        initializeQuestionOptions(q5.getId(), Arrays.asList(
            createOption(null, "A", "偏向锁 → 轻量级锁 → 重量级锁"),
            createOption(null, "B", "轻量级锁 → 偏向锁 → 重量级锁"),
            createOption(null, "C", "重量级锁 → 轻量级锁 → 偏向锁"),
            createOption(null, "D", "无锁 → 偏向锁 → 轻量级锁 → 重量级锁")
        ));

        initializeQuestionOptions(q6.getId(), Arrays.asList(
            createOption(null, "A", "CMS使用标记-清除算法，G1使用标记-整理算法"),
            createOption(null, "B", "G1将堆划分为多个大小相等的Region"),
            createOption(null, "C", "CMS适用于大堆场景，G1适用于大堆和低延迟场景"),
            createOption(null, "D", "G1可以设置期望的停顿时间")
        ));

        log.info("Initialized {} questions with options", questions.size());
    }

    private Question createQuestion(Long id, Long knowledgePointId, String content, String answer,
                                   String analysis, String difficulty, String type, String tags, String source) {
        Question question = new Question();
        question.setId(id);
        question.setKnowledgePointId(knowledgePointId);
        question.setContent(content);
        question.setAnswer(answer);
        question.setAnalysis(analysis);
        question.setDifficulty(difficulty);
        question.setType(type);
        question.setTags(tags);
        question.setSource(source);
        return question;
    }

    private QuestionOption createOption(Long questionId, String key, String value) {
        QuestionOption option = new QuestionOption();
        option.setQuestionId(questionId);
        option.setOptionKey(key);
        option.setOptionValue(value);
        return option;
    }

    private void initializeQuestionOptions(Long questionId, List<QuestionOption> options) {
        options.forEach(opt -> opt.setQuestionId(questionId));
        questionOptionRepository.saveAll(options);
    }
}
