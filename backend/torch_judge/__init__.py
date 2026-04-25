"""torch_judge - Task definitions and testing engine for LearningAI"""

from .tasks._registry import TASKS, get_task, list_tasks

__all__ = ["TASKS", "get_task", "list_tasks"]
