# LearningAI - 大模型知识点可视化学习平台

基于 pyre-code 的 68 个知识点，通过图解、动画和代码联动帮助深度理解大模型核心概念。

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS + Monaco Editor
- **后端**: FastAPI + Python 3.11
- **数据源**: pyre-code (D:/pyre-code)

## 快速开始

### 后端

```bash
cd backend
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
│   ├── utils/        # 工具函数（pyre_loader）
│   └── main.py       # 入口
├── frontend/         # React 前端
│   └── src/
│       ├── components/  # UI 组件
│       ├── pages/       # 页面
│       └── data/        # 静态数据
└── docs/            # 文档
    └── DESIGN.md    # 设计文档
```

## 开发计划

- [x] 项目骨架搭建
- [ ] 实现后端 API（加载 pyre-code 数据）
- [ ] 实现前端路径导航
- [ ] 实现知识点详情页
- [ ] 制作 SVG 图解
- [ ] 实现代码联动功能

详见 [DESIGN.md](docs/DESIGN.md)
