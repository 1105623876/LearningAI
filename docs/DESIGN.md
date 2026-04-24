# LearningAI 可视化学习平台 - 设计文档

**日期**: 2026-04-24  
**版本**: 1.0  
**状态**: 待审核

---

## 1. 项目概述

### 1.1 目标

构建一个基于 pyre-code 知识点的可视化学习平台，通过图解、动画和代码联动帮助用户深度理解大模型相关的核心概念。

### 1.2 核心需求

- **主要目标**: 概念深度理解 - 通过动画、图解等方式直观理解每个知识点的原理
- **技术方案**: 混合方案 - MVP 先做静态图解+代码联动，后续对核心概念补充交互动画
- **知识点覆盖**: 全部 68 个知识点（基础版），先覆盖全部，后续深化
- **界面布局**: 按学习路径分组 - 左侧显示 8 条学习路径，点击展开知识点
- **次要目标**: 如果有余力，加上知识地图导航和进度追踪

---

## 2. 系统架构

### 2.1 技术栈

**前端**:
- React 18+ (UI 框架)
- Tailwind CSS (样式)
- Monaco Editor (代码高亮和编辑)
- D3.js (后期交互动画)
- React Router (路由)

**后端**:
- FastAPI (Python 3.11+)
- 复用 pyre-code 的 conda 环境 (`D:\Miniconda3\envs\pyre`)

**数据源**:
- 直接读取 pyre-code 的题目定义 (`torch_judge/tasks/`)
- 学习路径配置 (`web/src/lib/paths.json`)

**开发工具**:
- Vite (前端构建)
- npm/pnpm (包管理)

### 2.2 目录结构

```
D:/vibecoding/LearningAI/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/       # UI 组件
│   │   │   ├── PathNav.jsx   # 左侧路径导航
│   │   │   ├── ConceptView.jsx  # 知识点详情页
│   │   │   ├── SVGDiagram.jsx   # SVG 图解组件
│   │   │   └── CodePanel.jsx    # 代码面板
│   │   ├── pages/
│   │   │   ├── Home.jsx      # 首页
│   │   │   └── Concept.jsx   # 知识点页面
│   │   ├── data/             # 静态数据
│   │   │   ├── concepts.json # 知识点元数据
│   │   │   └── diagrams/     # SVG 图解文件
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                  # FastAPI 后端
│   ├── main.py               # 入口
│   ├── api/
│   │   └── concepts.py       # 知识点 API
│   └── utils/
│       └── pyre_loader.py    # 加载 pyre-code 数据
├── docs/                     # 文档
│   └── DESIGN.md             # 本设计文档
└── README.md
```

---

## 3. 核心功能设计

### 3.1 第一阶段：静态图解 + 代码联动 (MVP)

**时间**: 2-3 周

#### 3.1.1 左侧导航

**功能**:
- 显示 8 条学习路径（树形结构，可折叠）
- 每条路径下显示其包含的知识点列表
- 点击知识点，右侧显示详情

**数据结构**:
```json
{
  "paths": [
    {
      "id": "transformer-internals",
      "titleZh": "Transformer 内部机制",
      "icon": "Layers",
      "problems": ["relu", "gelu", "layernorm", ...]
    }
  ]
}
```

**UI 设计**:
- 路径标题 + 图标
- 折叠/展开动画
- 当前选中项高亮

#### 3.1.2 知识点详情页

**布局**:
```
┌─────────────────────────────────────┐
│ 标题 | 难度标签 | 所属路径          │
├─────────────────────────────────────┤
│ 简短描述（中文）                    │
├─────────────────────────────────────┤
│                                     │
│         SVG 图解区域                │
│     (可点击元素高亮代码)            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      代码示例 (Monaco Editor)       │
│     (语法高亮 + 行号)               │
│                                     │
└─────────────────────────────────────┘
```

**交互**:
1. 点击 SVG 图解中的元素（如"Q 矩阵"）
2. 对应代码行高亮（如 `Q = x @ W_q`）
3. 可选：显示简短的 tooltip 说明

#### 3.1.3 SVG 图解设计

**风格选择**:
- 技术风格：清晰的线条、标注、箭头
- 配色：使用 Tailwind 的调色板，保持一致性

**示例（注意力机制）**:
```
输入 X (seq_len, d_model)
    ↓
┌───┴───┬───────┬───────┐
│  W_q  │  W_k  │  W_v  │
└───┬───┴───┬───┴───┬───┘
    ↓       ↓       ↓
    Q       K       V
    │       │       │
    └───┬───┘       │
        ↓           │
    Attention       │
    Scores          │
        │           │
        └─────┬─────┘
              ↓
           Output
```

**实现**:
- 每个知识点一个 SVG 文件
- 使用 `<g>` 分组，添加 `data-code-line` 属性关联代码行
- 点击事件触发代码高亮

#### 3.1.4 代码面板

**功能**:
- 使用 Monaco Editor 显示参考实现
- 语法高亮（Python）
- 行号显示
- 支持从 SVG 图解触发的行高亮

**数据来源**:
- 从 pyre-code 的 `torch_judge/tasks/*.py` 中提取 `solution` 字段

---

### 3.2 第二阶段：核心概念交互动画

**时间**: 2-3 周

**目标**: 为 5-10 个核心知识点添加交互式动画

**候选知识点**:
1. Attention (缩放点积注意力)
2. Multi-Head Attention
3. Flash Attention
4. RoPE (旋转位置编码)
5. Backpropagation (反向传播)
6. LayerNorm
7. Transformer Block
8. KV Cache
9. Beam Search
10. DPO Loss

**交互功能**:
- 参数滑块（如调整 `d_k`、`num_heads`）
- 逐步播放按钮（动画演示计算过程）
- 实时可视化（如注意力权重热力图）

**技术实现**:
- D3.js 或 Manim.js
- 每个动画作为独立组件
- 可选：使用 Web Workers 处理计算密集型动画

---

### 3.3 第三阶段：增强功能（可选）

**时间**: 1-2 周

#### 3.3.1 进度追踪

**功能**:
- 记录用户已查看的知识点
- 显示学习进度（如"Transformer 内部机制 8/12"）
- 本地存储（LocalStorage）

#### 3.3.2 知识图谱可视化

**功能**:
- 用节点和连线展示知识点之间的依赖关系
- 点击节点进入详情页
- 可选：显示学习路径的推荐

**技术**:
- D3.js Force Layout 或 Cytoscape.js

#### 3.3.3 搜索功能

**功能**:
- 按知识点名称搜索
- 按关键词搜索（如"注意力"）

---

## 4. 数据流设计

### 4.1 数据加载流程

```
启动后端 FastAPI
    ↓
加载 pyre-code 数据
    ├─ 读取 torch_judge/tasks/*.py (题目定义)
    ├─ 读取 web/src/lib/paths.json (学习路径)
    └─ 构建知识点索引
    ↓
提供 REST API
    ├─ GET /api/paths (获取所有学习路径)
    ├─ GET /api/concepts (获取所有知识点)
    └─ GET /api/concepts/:id (获取单个知识点详情)
    ↓
前端请求数据
    ↓
渲染 UI
```

### 4.2 API 设计

#### GET /api/paths
返回所有学习路径

**响应**:
```json
{
  "paths": [
    {
      "id": "transformer-internals",
      "titleZh": "Transformer 内部机制",
      "descriptionZh": "从零构建...",
      "icon": "Layers",
      "problems": ["relu", "gelu", "layernorm", ...],
      "prerequisites": []
    }
  ]
}
```

#### GET /api/concepts
返回所有知识点的元数据

**响应**:
```json
{
  "concepts": [
    {
      "id": "attention",
      "title": "Scaled Dot-Product Attention",
      "titleZh": "缩放点积注意力",
      "difficulty": "Medium",
      "category": "attention",
      "paths": ["transformer-internals", "attention-position"]
    }
  ]
}
```

#### GET /api/concepts/:id
返回单个知识点的详细信息

**响应**:
```json
{
  "id": "attention",
  "title": "Scaled Dot-Product Attention",
  "titleZh": "缩放点积注意力",
  "difficulty": "Medium",
  "descriptionZh": "实现缩放点积注意力机制...",
  "category": "attention",
  "paths": ["transformer-internals"],
  "code": "def scaled_dot_product_attention(...):\n    ...",
  "diagramPath": "/diagrams/attention.svg",
  "codeLineMapping": {
    "q-matrix": [5],
    "k-matrix": [6],
    "scores": [8, 9]
  }
}
```

---

## 5. 组件设计

### 5.1 PathNav 组件

**职责**: 左侧学习路径导航

**Props**:
```typescript
interface PathNavProps {
  paths: Path[];
  currentConceptId: string;
  onConceptSelect: (conceptId: string) => void;
}
```

**状态**:
- `expandedPaths`: 当前展开的路径 ID 列表

**UI**:
- 路径标题（可点击折叠/展开）
- 知识点列表（缩进显示）
- 当前选中项高亮

### 5.2 ConceptView 组件

**职责**: 知识点详情页

**Props**:
```typescript
interface ConceptViewProps {
  conceptId: string;
}
```

**状态**:
- `concept`: 当前知识点数据
- `highlightedLines`: 当前高亮的代码行

**子组件**:
- `SVGDiagram`: SVG 图解
- `CodePanel`: 代码面板

### 5.3 SVGDiagram 组件

**职责**: 显示 SVG 图解并处理点击事件

**Props**:
```typescript
interface SVGDiagramProps {
  svgPath: string;
  codeLineMapping: Record<string, number[]>;
  onElementClick: (lines: number[]) => void;
}
```

**实现**:
- 加载 SVG 文件
- 为可点击元素添加事件监听
- 触发代码高亮回调

### 5.4 CodePanel 组件

**职责**: 显示代码并支持行高亮

**Props**:
```typescript
interface CodePanelProps {
  code: string;
  language: string;
  highlightedLines: number[];
}
```

**实现**:
- 使用 Monaco Editor
- 监听 `highlightedLines` 变化，更新高亮

---

## 6. 错误处理

### 6.1 数据加载失败

**场景**: pyre-code 数据加载失败

**处理**:
- 后端返回 500 错误
- 前端显示友好的错误提示："无法加载知识点数据，请检查 pyre-code 路径"

### 6.2 SVG 图解缺失

**场景**: 某个知识点的 SVG 图解文件不存在

**处理**:
- 显示占位符："该知识点的图解正在制作中"
- 仍然显示代码面板

### 6.3 代码高亮映射错误

**场景**: SVG 元素的 `data-code-line` 属性指向不存在的行号

**处理**:
- 忽略该点击事件
- 在控制台输出警告（开发模式）

---

## 7. 测试策略

### 7.1 单元测试

**工具**: Vitest (前端), pytest (后端)

**覆盖**:
- 数据加载逻辑（`pyre_loader.py`）
- API 端点（`concepts.py`）
- 组件渲染（React Testing Library）

### 7.2 集成测试

**场景**:
- 从 pyre-code 加载数据 → API 返回正确格式
- 点击 SVG 元素 → 代码行高亮

### 7.3 手动测试

**检查项**:
- 所有 68 个知识点都能正常显示
- SVG 图解和代码联动正常
- 路径导航折叠/展开流畅
- 响应式布局（桌面端）

---

## 8. 部署方案

### 8.1 开发环境

**启动命令**:
```bash
# 后端
cd backend
conda activate pyre
uvicorn main:app --reload --port 8001

# 前端
cd frontend
npm run dev
```

**访问**: `http://localhost:5173`

### 8.2 生产环境（可选）

**方案 1**: 本地部署
- 前端构建：`npm run build`
- 后端：`uvicorn main:app --host 0.0.0.0 --port 8001`

**方案 2**: Docker
- 编写 `Dockerfile` 和 `docker-compose.yml`
- 一键启动前后端

---

## 9. 实现计划

### 9.1 第一阶段（2-3 周）

**Week 1**:
- [ ] 搭建项目骨架（前端 + 后端）
- [ ] 实现数据加载逻辑（从 pyre-code 读取数据）
- [ ] 实现 API 端点（`/api/paths`, `/api/concepts`, `/api/concepts/:id`）
- [ ] 实现左侧路径导航组件

**Week 2**:
- [ ] 实现知识点详情页布局
- [ ] 实现代码面板（Monaco Editor）
- [ ] 制作 10 个知识点的 SVG 图解（优先基础概念）
- [ ] 实现 SVG 图解和代码联动

**Week 3**:
- [ ] 完成剩余 58 个知识点的 SVG 图解
- [ ] 优化 UI/UX（响应式、动画、加载状态）
- [ ] 测试和 bug 修复
- [ ] 编写 README 和使用文档

### 9.2 第二阶段（2-3 周）

**Week 4-5**:
- [ ] 选择 5-10 个核心知识点
- [ ] 为每个知识点设计交互动画
- [ ] 实现动画组件（D3.js）
- [ ] 集成到详情页

**Week 6**:
- [ ] 测试和优化动画性能
- [ ] 用户反馈收集和迭代

### 9.3 第三阶段（可选，1-2 周）

- [ ] 实现进度追踪功能
- [ ] 实现知识图谱可视化
- [ ] 实现搜索功能

---

## 10. 风险和缓解

### 10.1 SVG 图解制作工作量大

**风险**: 68 个知识点的图解制作耗时

**缓解**:
- 优先制作核心概念的图解
- 使用模板和组件复用（如矩阵、箭头）
- 考虑使用 AI 辅助生成初稿

### 10.2 交互动画性能问题

**风险**: 复杂动画导致浏览器卡顿

**缓解**:
- 使用 Web Workers 处理计算
- 优化 D3.js 渲染（虚拟化、节流）
- 提供"简化模式"选项

### 10.3 pyre-code 数据格式变化

**风险**: pyre-code 更新导致数据加载失败

**缓解**:
- 编写健壮的数据解析逻辑
- 添加版本检查和兼容性处理
- 定期同步 pyre-code 更新

---

## 11. 未来扩展

### 11.1 多语言支持

- 英文界面
- 国际化（i18n）

### 11.2 社区功能

- 用户笔记和标注
- 分享学习进度
- 讨论区

### 11.3 移动端适配

- 响应式设计
- 触摸手势支持

### 11.4 与 pyre-code 深度集成

- 在 LearningAI 中直接做题
- 同步进度到 pyre-code

---

## 12. 总结

本设计文档描述了 LearningAI 可视化学习平台的完整架构和实现计划。核心思路是：

1. **MVP 快速迭代**：先用静态图解+代码联动覆盖全部 68 个知识点
2. **深化核心概念**：为重点知识点添加交互动画
3. **渐进式增强**：根据反馈逐步添加进度追踪、知识图谱等功能

预计第一阶段（MVP）可在 2-3 周内完成，交付一个可用的学习平台。
