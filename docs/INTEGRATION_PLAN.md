# LearningAI 整合 pyre-code 实践功能 - 实现方案

**日期**: 2026-04-24  
**目标**: 将 pyre-code 的代码实践功能无缝融入 LearningAI，形成"理解 → 实践"的完整学习闭环

---

## 一、整合策略

### 方案选择：轻量级整合（推荐）

**不做**：完整复制 pyre-code 的所有功能（用户系统、进度追踪、AI 辅助）  
**只做**：核心的"编辑器 + 测试"功能，保持 LearningAI 的轻量特性

**原因**：
- LearningAI 定位是"理解工具"，不是"刷题平台"
- 避免功能重复，保持与 pyre-code 的差异化
- 降低开发和维护成本

---

## 二、功能设计

### 2.1 新增"实践模式"

在知识点详情页增加一个 Tab 切换：

```
┌─────────────────────────────────────┐
│ [理解模式] [实践模式]               │
├─────────────────────────────────────┤
│                                     │
│  理解模式：SVG 图解 + 参考代码      │
│  实践模式：编辑器 + 测试用例        │
│                                     │
└─────────────────────────────────────┘
```

### 2.2 实践模式界面

```
┌─────────────────────────────────────┐
│ 题目描述（中文）                    │
│ - 函数签名                          │
│ - 参数说明                          │
│ - 返回值说明                        │
│ - 约束条件                          │
├─────────────────────────────────────┤
│                                     │
│      Monaco Editor（可编辑）        │
│      - 语法高亮                     │
│      - 自动补全                     │
│      - 错误提示                     │
│                                     │
├─────────────────────────────────────┤
│ [运行测试] [查看提示] [查看答案]   │
├─────────────────────────────────────┤
│ 测试结果：                          │
│ ✓ Test 1: Output shape              │
│ ✓ Test 2: Numerical correctness     │
│ ✗ Test 3: Gradient check            │
│   Error: Q.grad is None             │
└─────────────────────────────────────┘
```

### 2.3 核心功能

1. **代码编辑器**
   - 使用 Monaco Editor（与 pyre-code 相同）
   - 支持 Python 语法高亮、自动补全
   - 初始代码：函数签名 + TODO 注释

2. **运行测试**
   - 调用 pyre-code 的 grading_service API
   - 显示每个测试用例的通过/失败状态
   - 显示错误信息和执行时间

3. **查看提示**
   - 显示 pyre-code 题目中的 hint 字段
   - 渐进式提示（先显示思路，再显示代码片段）

4. **查看答案**
   - 显示 pyre-code 的参考答案
   - 与用户代码对比（diff 视图）

---

## 三、技术实现

### 3.1 后端改动

#### 3.1.1 新增 API 端点

**文件**: `backend/api/practice.py`

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/api/practice", tags=["practice"])

class SubmitRequest(BaseModel):
    concept_id: str
    code: str

@router.post("/submit")
async def submit_code(req: SubmitRequest):
    """提交代码到 pyre-code grading service"""
    try:
        # 调用 pyre-code 的 grading service
        response = requests.post(
            "http://localhost:8000/run",
            json={"taskId": req.concept_id, "code": req.code}
        )
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/task/{concept_id}")
async def get_task(concept_id: str):
    """获取题目详情（从 pyre-code 的 torch_judge）"""
    try:
        from torch_judge.tasks import get_task
        task = get_task(concept_id)
        return {
            "title": task.get("title"),
            "description": task.get("description_zh"),
            "function_name": task.get("function_name"),
            "hint": task.get("hint_zh"),
            "solution": task.get("solution"),
            "tests": [{"name": t["name"]} for t in task.get("tests", [])]
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
```

#### 3.1.2 修改 main.py

```python
from api.practice import router as practice_router

app.include_router(practice_router)
```

### 3.2 前端改动

#### 3.2.1 新增组件：PracticeMode.jsx

**文件**: `frontend/src/components/PracticeMode.jsx`

```jsx
import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

export default function PracticeMode({ conceptId }) {
  const [task, setTask] = useState(null)
  const [code, setCode] = useState('')
  const [testResults, setTestResults] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 加载题目
    fetch(`http://localhost:8001/api/practice/task/${conceptId}`)
      .then(r => r.json())
      .then(data => {
        setTask(data)
        // 初始代码：函数签名 + TODO
        setCode(`def ${data.function_name}(...):\n    # TODO: 实现这个函数\n    pass`)
      })
  }, [conceptId])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8001/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept_id: conceptId, code })
      })
      const results = await response.json()
      setTestResults(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!task) return <div>加载中...</div>

  return (
    <div className="space-y-6">
      {/* 题目描述 */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">题目描述</h3>
        <div className="text-slate-300 text-sm whitespace-pre-line">
          {task.description}
        </div>
      </div>

      {/* 代码编辑器 */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">代码编辑器</h3>
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <Editor
            height="400px"
            language="python"
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false
            }}
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? '运行中...' : '运行测试'}
        </button>
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
        >
          {showHint ? '隐藏提示' : '查看提示'}
        </button>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
        >
          {showSolution ? '隐藏答案' : '查看答案'}
        </button>
      </div>

      {/* 提示 */}
      {showHint && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h3 className="text-amber-400 font-semibold mb-2">💡 提示</h3>
          <p className="text-slate-300 text-sm">{task.hint}</p>
        </div>
      )}

      {/* 答案 */}
      {showSolution && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">参考答案</h3>
          <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
            <code>{task.solution}</code>
          </pre>
        </div>
      )}

      {/* 测试结果 */}
      {testResults && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">测试结果</h3>
          <div className="space-y-2">
            {testResults.results?.map((result, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  result.passed ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                }`}
              >
                <span className="text-xl">
                  {result.passed ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <div className={`font-medium ${
                    result.passed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {result.name}
                  </div>
                  {result.error && (
                    <div className="text-sm text-slate-400 mt-1">
                      {result.error}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {result.execTimeMs.toFixed(1)}ms
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              通过: {testResults.passed}/{testResults.total} · 
              总耗时: {testResults.totalTimeMs.toFixed(1)}ms
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 3.2.2 修改 ConceptView.jsx

添加 Tab 切换：

```jsx
import { useState } from 'react'
import PracticeMode from './PracticeMode'

export default function ConceptView({ conceptId }) {
  const [mode, setMode] = useState('understand') // 'understand' | 'practice'

  return (
    <div className="h-full overflow-y-auto bg-slate-900">
      {/* 标题栏 */}
      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white mb-4">{concept.titleZh}</h1>
        
        {/* Tab 切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('understand')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'understand'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            理解模式
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'practice'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            实践模式
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-6">
        {mode === 'understand' ? (
          // 原有的图解 + 代码展示
          <div className="max-w-6xl mx-auto space-y-6">
            <SVGDiagram ... />
            <CodePanel ... />
          </div>
        ) : (
          // 新增的实践模式
          <div className="max-w-6xl mx-auto">
            <PracticeMode conceptId={conceptId} />
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 四、依赖关系

### 4.1 需要 pyre-code 的 grading_service 运行

**启动方式**：
```bash
# 在 pyre-code 目录
cd D:/pyre-code
conda activate pyre
python -m uvicorn grading_service.main:app --port 8000
```

**或者**：将 grading_service 复制到 LearningAI 项目中（推荐）

### 4.2 需要 torch_judge 包

**方案 A**：在 LearningAI 的 backend 中安装 torch_judge
```bash
cd D:/vibecoding/LearningAI/backend
pip install -e D:/pyre-code
```

**方案 B**：直接读取 pyre-code 的 torch_judge/tasks/*.py 文件

---

## 五、实现步骤

### 第一阶段：基础整合（2-3 天）

1. ✅ 复制 pyre-code 的 grading_service 到 LearningAI
2. ✅ 创建 `backend/api/practice.py`
3. ✅ 创建 `frontend/src/components/PracticeMode.jsx`
4. ✅ 修改 `ConceptView.jsx` 添加 Tab 切换
5. ✅ 测试基本流程：编辑代码 → 提交 → 查看结果

### 第二阶段：体验优化（2-3 天）

1. ✅ 优化编辑器配置（自动补全、错误提示）
2. ✅ 优化测试结果展示（动画、颜色）
3. ✅ 添加"查看提示"渐进式展示
4. ✅ 添加"查看答案"与用户代码对比
5. ✅ 添加本地存储（保存用户代码）

### 第三阶段：增强功能（可选，1-2 周）

1. ⬜ 添加代码模板（常用导入、函数框架）
2. ⬜ 添加"运行单个测试"功能
3. ⬜ 添加"性能分析"（执行时间、内存占用）
4. ⬜ 添加"代码质量检查"（PEP8、类型提示）
5. ⬜ 添加"学习进度"（已完成的题目）

---

## 六、优势分析

### 6.1 相比 pyre-code 的差异化

| 维度 | pyre-code | LearningAI |
|------|-----------|------------|
| **定位** | 刷题平台 | 学习平台 |
| **核心价值** | 通过做题掌握技能 | 通过理解掌握原理 |
| **学习路径** | 题目 → 代码 → 测试 | 图解 → 理解 → 实践 |
| **用户体验** | 专业、完整 | 轻量、直观 |

### 6.2 整合后的优势

1. **完整的学习闭环**：理解（图解）→ 实践（编码）→ 验证（测试）
2. **降低学习门槛**：先看图解理解原理，再动手实现
3. **保持轻量特性**：不复制 pyre-code 的所有功能
4. **与 pyre-code 互补**：LearningAI 是"预习工具"，pyre-code 是"刷题平台"

---

## 七、风险与缓解

### 7.1 依赖 pyre-code 的 grading_service

**风险**：如果 pyre-code 更新，可能导致 API 不兼容

**缓解**：
- 将 grading_service 复制到 LearningAI 项目中
- 或者：自己实现一个简化版的测试执行器

### 7.2 代码执行安全性

**风险**：用户提交的代码可能包含恶意操作

**缓解**：
- 使用 pyre-code 的代码验证逻辑（禁止某些语句）
- 在沙箱环境中执行代码
- 限制执行时间和内存

### 7.3 功能重复

**风险**：与 pyre-code 功能重复，失去差异化

**缓解**：
- 明确定位：LearningAI 是"理解工具"，不是"刷题平台"
- 只实现核心的"编辑 + 测试"功能
- 保持与 pyre-code 的互补关系

---

## 八、总结

**核心思路**：轻量级整合，保持差异化

**实现方式**：
1. 复用 pyre-code 的 grading_service 和 torch_judge
2. 在 LearningAI 中添加"实践模式"
3. 形成"理解 → 实践"的完整学习闭环

**预期效果**：
- 用户在 LearningAI 中先看图解理解原理
- 然后在实践模式中动手实现
- 最后去 pyre-code 刷更多题目巩固技能

**开发时间**：2-3 天完成基础整合，1 周完成体验优化
