# LearningAI - 大模型知识点可视化学习平台

基于 pyre-code 的 68 个知识点，通过图解、动画和代码联动帮助深度理解大模型核心概念。

**核心特色**：理解模式（SVG 图解 + 代码讲解）+ 实践模式（在线编辑器 + 实时测试）

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS + Monaco Editor
- **后端**: FastAPI + Python 3.11
- **数据源**: 内置 68 个知识点题目（来自 pyre-code，MIT 协议）
- **测试引擎**: 内置 torch_judge 测试引擎

## 快速开始

### 后端

```bash
cd backend
start.bat  # Windows
# 或
conda activate pyre
python main.py
```

后端运行在 `http://localhost:8001`

### 前端

```bash
cd frontend
npm run dev
```

前端运行在 `http://localhost:5173`

## 项目结构

```
LearningAI/
├── backend/          # FastAPI 后端
│   ├── api/          # API 路由
│   │   ├── concepts.py   # 知识点 API
│   │   └── practice.py   # 实践模式 API
│   ├── data/         # 数据文件
│   │   └── paths.json    # 学习路径配置
│   ├── torch_judge/  # 测试引擎
│   │   └── tasks/        # 68 个题目定义
│   ├── utils/        # 工具函数
│   ├── main.py       # 入口
│   └── start.bat     # 启动脚本（Windows）
├── frontend/         # React 前端
│   └── src/
│       ├── components/  # UI 组件
│       │   ├── ConceptView.jsx    # 知识点详情页
│       │   ├── PracticeMode.jsx   # 实践模式
│       │   ├── SVGDiagram.jsx     # SVG 图解
│       │   └── CodePanel.jsx      # 代码面板
│       ├── pages/       # 页面
│       └── data/        # 静态数据
│           └── diagrams/  # 68 个 SVG 图解
└── docs/            # 文档
    ├── DESIGN.md           # 设计文档
    └── INTEGRATION_PLAN.md # 整合方案
```

## 功能特性

### ✅ 已完成

- [x] 项目骨架搭建
- [x] 后端 API（加载 pyre-code 数据）
- [x] 前端路径导航（8 条学习路径）
- [x] 知识点详情页（理解模式）
- [x] 68 个 SVG 图解（完整覆盖所有概念）
- [x] 代码联动功能（点击图解高亮代码）
- [x] **实践模式**（在线编辑器 + 实时测试）
  - Monaco Editor 代码编辑
  - 运行测试并查看结果
  - 查看提示和参考答案
  - 复用 pyre-code 的 torch_judge 测试引擎

### 🚧 进行中

- [ ] 优化 UI/UX 细节
- [ ] 添加进度追踪功能
- [ ] 响应式设计（移动端适配）

### 📋 计划中

- [ ] 交互动画（5-10 个核心概念）
- [ ] 搜索功能
- [ ] 知识图谱可视化
- [ ] 本地存储（保存用户代码和进度）
- [ ] 多语言支持（英文界面）

## 最近更新（2026-04-24）

### 整合 pyre-code 实践功能

成功将 pyre-code 的代码实践功能整合到 LearningAI，形成"理解 → 实践"的完整学习闭环：

1. **新增实践模式**
   - 在知识点详情页添加"理解模式"和"实践模式"切换
   - 实践模式提供可编辑的 Monaco Editor
   - 支持运行测试、查看提示、查看答案

2. **后端改动**
   - 创建 `backend/api/practice.py`：提供题目获取和代码提交接口
   - 复用 pyre-code 的 `torch_judge` 进行代码测试
   - 实现代码验证和测试执行逻辑

3. **前端改动**
   - 创建 `PracticeMode.jsx`：可编辑的代码编辑器 + 测试结果展示
   - 修改 `ConceptView.jsx`：添加模式切换 Tab
   - 支持查看提示、查看答案、运行测试等功能

4. **SVG 图解优化**
   - 修复多个 SVG 文件的 viewBox 高度问题
   - 修复 DPO Loss 等图解的宽度超出问题
   - 统一框的宽度，解决显示不一致问题
   - 所有图解现在都能完整显示，不会被截断

### 技术亮点

- **轻量级整合**：只复用核心的测试执行功能，保持 LearningAI 的简洁特性
- **完整闭环**：理解原理（图解）→ 动手实现（编码）→ 验证结果（测试）
- **差异化定位**：LearningAI 是"理解工具"，pyre-code 是"刷题平台"，两者互补

## 开发指南

### 启动后端

```bash
cd backend
# Windows
start.bat

# 或手动启动（需要 PyTorch 环境）
conda activate pyre  # 或其他包含 PyTorch 的环境
python main.py
```

### 启动前端

```bash
cd frontend
npm run dev
```

### 添加新的 SVG 图解

1. 在 `frontend/src/data/diagrams/` 创建 `{concept_id}.svg`
2. 使用 `data-code-line` 属性关联代码行
3. 确保 viewBox 高度足够（建议 650+）
4. 测试图解是否完整显示

## 相关文档

- [设计文档](docs/DESIGN.md) - 完整的系统架构和功能设计
- [整合方案](docs/INTEGRATION_PLAN.md) - pyre-code 实践功能整合方案

## 致谢

- 题目数据和测试引擎来自 [pyre-code](https://github.com/whwangovo/pyre-code)（MIT 协议）
- 基于 [TorchCode](https://github.com/duoan/TorchCode) 的 torch_judge
