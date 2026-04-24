#!/bin/bash

echo "启动 LearningAI..."
echo ""

# 启动后端
echo "启动后端 (http://localhost:8001)..."
cd backend
D:/Miniconda3/envs/pyre/python.exe main.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端
echo "启动前端 (http://localhost:5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✓ 后端运行在 http://localhost:8001"
echo "✓ 前端运行在 http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
wait
