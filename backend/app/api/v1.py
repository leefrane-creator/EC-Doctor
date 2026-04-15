"""
EC Doctor API v1 路由
POST /api/v1/diagnose - 核心诊断接口
GET  /api/v1/health - 健康检查
"""

import time
import uuid
import asyncio
import logging

from fastapi import APIRouter, HTTPException

from ..models.schemas import DiagnoseRequest, DiagnoseResponse, AgentResult
from ..agents.ui_ux_agent import UIUXAgent
from ..agents.copywriting_agent import CopywritingAgent
from ..agents.operations_agent import OperationsAgent
from ..agents.competitor_agent import CompetitorAgent
from ..agents.compliance_agent import ComplianceAgent

logger = logging.getLogger("ecdoctor.api")

router = APIRouter(prefix="/api/v1", tags=["ec-doctor"])

# Agent 注册表：按模式选择启用哪些 Agent
AGENT_REGISTRY = {
    "full": [
        ("uiux", UIUXAgent),
        ("copywriting", CopywritingAgent),
        ("operations", OperationsAgent),
        ("competitor", CompetitorAgent),
        ("compliance", ComplianceAgent),
    ],
    "quick": [
        ("uiux", UIUXAgent),
        ("copywriting", CopywritingAgent),
        ("compliance", ComplianceAgent),
    ],
    "compliance_only": [
        ("compliance", ComplianceAgent),
    ],
}


def _extract_score(agent_data: dict) -> float:
    """从 Agent 返回结果中提取综合评分"""
    data = agent_data.get("data", {})
    score_keys = [
        "overall_ui_ux_score", "overall_copy_score",
        "overall_operations_score", "overall_competitive_score",
        "overall_compliance_score",
    ]
    for key in score_keys:
        if key in data and isinstance(data[key], (int, float)):
            return float(data[key])
    return 0.0


def _score_to_grade(score: float) -> str:
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "E"


def _count_issues(data: dict) -> tuple:
    def cnt(key):
        items = data.get(key, [])
        return len(items) if isinstance(items, list) else 0
    return (cnt("p0_issues"), cnt("p1_issues"), cnt("p2_issues"))


@router.post("/diagnose", response_model=DiagnoseResponse)
async def diagnose(req: DiagnoseRequest):
    """
    核心诊断接口 - 接收商品详情，并行调用多个专家 Agent 分析
    模式说明：
    - full: 完整诊断（5 专家），最全面
    - quick: 快速诊断（3 专家），适合初筛
    - compliance_only: 仅合规检查，最快
    """
    task_id = uuid.uuid4().hex[:12]
    start = time.time()
    mode = req.mode or "full"

    logger.info(
        "[%s] Start diagnose | mode=%s | product=%s",
        task_id, mode,
        req.product_info.title[:30]
    )

    ctx = {
        "product_info": req.product_info.model_dump(),
        "platform": req.product_info.platform,
        "category": req.product_info.category,
        "user_id": req.user_id,
    }
    if req.competitor_info:
        ctx["competitor_info"] = req.competitor_info

    agent_classes = AGENT_REGISTRY.get(mode, AGENT_REGISTRY["full"])

    async def run_one(name, cls):
        t0 = time.time()
        try:
            agent = cls()
            result = await agent.run(ctx)
            ms = int((time.time() - t0) * 1000)
            return AgentResult(
                agent_name=name,
                score=_extract_score(result),
                data=result.get("data", {}),
                latency_ms=ms,
            )
        except Exception as e:
            logger.error("[%s] Agent %s failed: %s", task_id, name, e)
            return AgentResult(
                agent_name=name,
                score=0.0,
                data={"error": str(e)},
                latency_ms=int((time.time() - t0) * 1000),
            )

    tasks = [run_one(name, cls) for name, cls in agent_classes]
    results = await asyncio.gather(*tasks)

    # 汇总统计
    scores = [r.score for r in results if r.score > 0]
    overall = sum(scores) / len(scores) if scores else 0.0

    total_p0 = sum(_count_issues(r.data)[0] for r in results)
    total_p1 = sum(_count_issues(r.data)[1] for r in results)
    total_p2 = sum(_count_issues(r.data)[2] for r in results)

    # 提取 Top 建议
    top_suggestions = []
    for r in results:
        data = r.data
        for issue in data.get("p0_issues", []):
            top_suggestions.append({
                "agent": r.agent_name,
                "priority": "P0",
                "issue": issue.get("area", "") + ": " + issue.get("issue", ""),
                "suggestion": issue.get("suggestion", ""),
            })
        for item in data.get("quick_wins", []):
            top_suggestions.append({
                "agent": r.agent_name,
                "priority": "QUICK_WIN",
                "issue": str(item)[:100],
                "suggestion": "",
            })

    top_suggestions.sort(key=lambda x: 0 if x["priority"] == "P0" else 1)
    top_suggestions = top_suggestions[:10]

    elapsed_ms = (time.time() - start) * 1000
    logger.info(
        "[%s] Done | score=%.1f | P0=%d P1=%d P2=%d | %.0fms",
        task_id, overall, total_p0, total_p1, total_p2, elapsed_ms
    )

    return DiagnoseResponse(
        task_id=task_id,
        overall_score=round(overall, 1),
        grade=_score_to_grade(overall),
        summary=f"共调用 {len(results)} 位专家，发现 {total_p0} 个严重问题、{total_p1} 个中等问题、{total_p2} 个优化项。",
        agents=results,
        p0_count=total_p0,
        p1_count=total_p1,
        p2_count=total_p2,
        top_suggestions=top_suggestions,
        raw_report={r.agent_name: r.data for r in results},
    )


@router.get("/health")
async def health():
    return {"status": "ok", "service": "ec-doctor", "version": "1.0.0"}
