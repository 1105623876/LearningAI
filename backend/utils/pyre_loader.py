import json
from pathlib import Path
from typing import Dict, List, Any

# 使用项目内部的数据路径
BACKEND_PATH = Path(__file__).parent.parent
DATA_PATH = BACKEND_PATH / "data"
TORCH_JUDGE_PATH = BACKEND_PATH / "torch_judge"

def load_paths() -> List[Dict[str, Any]]:
    """加载学习路径配置"""
    paths_file = DATA_PATH / "paths.json"
    if not paths_file.exists():
        raise FileNotFoundError(f"paths.json not found at {paths_file}")

    with open(paths_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("paths", [])

def load_tasks() -> Dict[str, Dict[str, Any]]:
    """加载所有题目定义"""
    try:
        from torch_judge.tasks._registry import TASKS
        return TASKS
    except ImportError as e:
        raise ImportError(f"Failed to import TASKS: {e}")

def build_concepts_index() -> List[Dict[str, Any]]:
    """构建知识点索引"""
    tasks = load_tasks()
    paths = load_paths()

    path_map = {}
    for path in paths:
        for problem_id in path.get("problems", []):
            if problem_id not in path_map:
                path_map[problem_id] = []
            path_map[problem_id].append(path["id"])

    concepts = []
    for task_id, task_data in tasks.items():
        concept = {
            "id": task_id,
            "title": task_data.get("title", ""),
            "titleZh": task_data.get("title_zh", task_data.get("title", "")),
            "difficulty": task_data.get("difficulty", "Medium"),
            "category": task_data.get("category", "general"),
            "paths": path_map.get(task_id, [])
        }
        concepts.append(concept)

    return concepts

def get_concept_detail(concept_id: str) -> Dict[str, Any]:
    """获取单个知识点的详细信息"""
    tasks = load_tasks()

    if concept_id not in tasks:
        raise ValueError(f"Concept {concept_id} not found")

    task_data = tasks[concept_id]
    paths = load_paths()

    concept_paths = []
    for path in paths:
        if concept_id in path.get("problems", []):
            concept_paths.append(path["id"])

    solution_code = task_data.get("solution", "")

    return {
        "id": concept_id,
        "title": task_data.get("title", ""),
        "titleZh": task_data.get("title_zh", task_data.get("title", "")),
        "difficulty": task_data.get("difficulty", "Medium"),
        "descriptionZh": task_data.get("description_zh", task_data.get("description_en", "")),
        "category": task_data.get("category", "general"),
        "paths": concept_paths,
        "code": solution_code,
        "diagramPath": f"/diagrams/{concept_id}.svg",
        "codeLineMapping": {}
    }
