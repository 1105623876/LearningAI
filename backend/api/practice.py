from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
from pathlib import Path

# 添加 pyre-code 路径以导入 torch_judge
pyre_code_path = Path("D:/pyre-code")
if str(pyre_code_path) not in sys.path:
    sys.path.insert(0, str(pyre_code_path))

try:
    from torch_judge.tasks import get_task
except ImportError:
    get_task = None

router = APIRouter(prefix="/api/practice", tags=["practice"])

class SubmitRequest(BaseModel):
    concept_id: str
    code: str

class TestResult(BaseModel):
    name: str
    passed: bool
    execTimeMs: float
    error: Optional[str] = None
    output: Optional[str] = None

class GradeResponse(BaseModel):
    passed: int
    total: int
    allPassed: bool
    results: List[TestResult]
    totalTimeMs: float
    error: Optional[str] = None

@router.get("/task/{concept_id}")
async def get_task_detail(concept_id: str) -> Dict[str, Any]:
    """获取题目详情（从 pyre-code 的 torch_judge）"""
    if get_task is None:
        raise HTTPException(
            status_code=500,
            detail="torch_judge not available. Please ensure pyre-code is installed."
        )

    try:
        task = get_task(concept_id)
        return {
            "id": concept_id,
            "title": task.get("title"),
            "titleZh": task.get("title"),
            "description": task.get("description_zh", task.get("description_en", "")),
            "functionName": task.get("function_name"),
            "hint": task.get("hint_zh", task.get("hint", "")),
            "solution": task.get("solution", ""),
            "tests": [{"name": t["name"]} for t in task.get("tests", [])],
            "difficulty": task.get("difficulty", "Medium")
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Task not found: {str(e)}")

@router.post("/submit")
async def submit_code(req: SubmitRequest) -> GradeResponse:
    """提交代码并运行测试"""
    if get_task is None:
        raise HTTPException(
            status_code=500,
            detail="torch_judge not available. Please ensure pyre-code is installed."
        )

    try:
        task = get_task(req.concept_id)
        result = _execute_tests(req.code, task)
        return result
    except Exception as e:
        return GradeResponse(
            passed=0,
            total=0,
            allPassed=False,
            results=[],
            totalTimeMs=0.0,
            error=str(e)
        )

def _validate_code(code: str) -> Optional[str]:
    """验证代码是否包含不允许的顶层语句"""
    import ast
    allowed = (
        ast.FunctionDef, ast.AsyncFunctionDef,
        ast.ClassDef,
        ast.Import, ast.ImportFrom,
        ast.Assign, ast.AnnAssign, ast.AugAssign,
        ast.Expr,
    )
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return f"Syntax error: {e}"
    for node in tree.body:
        if not isinstance(node, allowed):
            return f"Only definitions and assignments are allowed at the top level (found: {type(node).__name__})"
    return None

def _execute_tests(code: str, task: dict) -> GradeResponse:
    """执行测试用例"""
    import torch
    import math
    import time

    err = _validate_code(code)
    if err:
        return GradeResponse(
            passed=0, total=0, allPassed=False,
            results=[], totalTimeMs=0.0, error=err
        )

    user_ns: Dict[str, Any] = {
        "torch": torch,
        "Tensor": torch.Tensor,
        "nn": torch.nn,
        "F": torch.nn.functional,
        "math": math,
    }

    try:
        exec(code, user_ns)
    except Exception as e:
        return GradeResponse(
            passed=0, total=0, allPassed=False,
            results=[], totalTimeMs=0.0, error=f"Execution error: {e}"
        )

    fn_name = task.get("function_name")
    if fn_name is None:
        return GradeResponse(
            passed=0, total=0, allPassed=False,
            results=[], totalTimeMs=0.0, error="Task has no function_name defined"
        )

    if fn_name not in user_ns:
        return GradeResponse(
            passed=0, total=0, allPassed=False,
            results=[], totalTimeMs=0.0,
            error=f"Function '{fn_name}' not found in submitted code"
        )

    tests = task.get("tests", [])
    results = []
    total_time = 0.0
    passed_count = 0

    for test in tests:
        test_code = test["code"].replace("{fn}", fn_name)
        start = time.perf_counter()

        try:
            exec(test_code, user_ns)
            elapsed = (time.perf_counter() - start) * 1000
            results.append(TestResult(
                name=test["name"],
                passed=True,
                execTimeMs=elapsed,
                error=None,
                output=None
            ))
            passed_count += 1
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000
            results.append(TestResult(
                name=test["name"],
                passed=False,
                execTimeMs=elapsed,
                error=str(e),
                output=None
            ))

        total_time += elapsed

    return GradeResponse(
        passed=passed_count,
        total=len(tests),
        allPassed=passed_count == len(tests),
        results=results,
        totalTimeMs=total_time,
        error=None
    )
