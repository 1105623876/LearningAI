from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..utils.pyre_loader import load_paths, build_concepts_index, get_concept_detail

router = APIRouter(prefix="/api", tags=["concepts"])

@router.get("/paths")
async def get_paths() -> Dict[str, List[Dict[str, Any]]]:
    """获取所有学习路径"""
    try:
        paths = load_paths()
        return {"paths": paths}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load paths: {str(e)}")

@router.get("/concepts")
async def get_concepts() -> Dict[str, List[Dict[str, Any]]]:
    """获取所有知识点的元数据"""
    try:
        concepts = build_concepts_index()
        return {"concepts": concepts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load concepts: {str(e)}")

@router.get("/concepts/{concept_id}")
async def get_concept(concept_id: str) -> Dict[str, Any]:
    """获取单个知识点的详细信息"""
    try:
        concept = get_concept_detail(concept_id)
        return concept
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load concept: {str(e)}")
