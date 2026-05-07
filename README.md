# Java面试刷题学习系统

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue" alt="Tailwind">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-green" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-8.0-orange" alt="MySQL">
</p>

## 项目简介

**「代码修炼阁」** 是一款专注于Java技术面试的智能化刷题学习平台。通过精细化的知识层级组织、即时深度反馈和科学的间隔重复算法（SM-2），帮助用户实现深度学习而非走马观花。

### 核心特性

- 📚 **四级知识体系**：题库 → 知识领域 → 具体知识点 → 题目
- ⚡ **即时反馈**：答题后立即显示详细解析
- 🧠 **间隔重复**：基于SM-2算法的智能复习队列
- 📊 **薄弱点追踪**：自动识别并强化薄弱知识点
- 🎯 **专项练习**：针对特定知识点精准练习
- 📝 **错题本**：智能错题管理，形成巩固闭环

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- Zustand (状态管理)
- React Router v6 (路由)
- Framer Motion (动画)
- Recharts (图表)

### 后端 (规划中)
- Spring Boot 3.x
- MyBatis-Plus
- MySQL 8.0
- Redis (缓存/队列)
- Spring Security + JWT

## 快速开始

### 前端启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 后端启动 (规划中)

```bash
cd backend

# 初始化数据库
mysql -u root -p < src/main/resources/sql/init.sql

# 启动后端服务
mvn spring-boot:run
```

## 项目结构

```
java-interview-learning/
├── src/
│   ├── components/          # React组件
│   │   ├── layout/         # 布局组件
│   │   └── ...
│   ├── pages/              # 页面组件
│   ├── store/              # 状态管理
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript类型
│   └── data/               # 静态数据
├── public/
├── package.json
└── vite.config.ts
```

## 核心功能

### 1. 知识树浏览
可视化浏览Java面试知识体系，支持展开/收起、搜索、筛选等功能。

### 2. 专项练习
选择特定知识点进行针对性练习，支持难度筛选和题目数量设置。

### 3. 即时反馈
- 答题后立即显示对错
- 详细的知识点解析
- 错误选项辨析
- 关联知识点延伸

### 4. 间隔重复 (SM-2算法)
根据用户答题情况，智能调整复习间隔：
- 正确：间隔逐渐拉长（1天 → 6天 → 15天 → 30天...）
- 错误：间隔重置并缩短

### 5. 错题本
- 自动收集错题
- 显示下次复习时间
- 掌握度可视化

### 6. 学习统计
- 各知识点掌握度
- 答题趋势
- 薄弱点分析

## 知识体系

```
Java基础
├── 集合框架
│   ├── ArrayList原理与源码
│   ├── HashMap原理与源码
│   └── ConcurrentHashMap
├── JVM虚拟机
│   ├── 内存结构
│   ├── 垃圾回收
│   └── 类加载机制
└── 多线程与并发
    ├── synchronized
    ├── volatile与内存屏障
    ├── 线程池原理
    └── AQS与ReentrantLock

Spring框架
├── IoC容器
├── AOP面向切面编程
└── Spring事务

数据库
├── 索引与存储
└── 事务与锁
```

## 设计理念

1. **专注性**：减少干扰，聚焦核心练习流程
2. **反馈性**：每个答案都有回应，每个错误都有解释
3. **成长性**：可视化的掌握进度，激发持续学习动力

## Roadmap

- [x] MVP版本 - 基础练习功能
- [ ] 用户认证系统
- [ ] 模拟考试功能
- [ ] 每日复习提醒
- [ ] 后端API开发
- [ ] 数据库持久化
- [ ] 移动端适配
- [ ] 题目导入导出

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

---

**开始你的Java面试修炼之旅！** 🚀
