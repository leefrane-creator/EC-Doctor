"""
EC Doctor Agent 基类
封装 LLM 调用、prompt 模板、结构化输出解析。
支持多模型：flash / pro / omni
兼容 OpenAI 及第三方网关（DeepSeek 等）。
"""
import json
import os
import logging
import re
from typing import Optional
from pathlib import Path

from dotenv import load_dotenv


def _load_env_files() -> None:
    """加载 .env 配置文件，优先级：backend/.env > 项目根 .env"""
    current = Path(__file__).resolve()
    backend_root = current.parents[2]
    repo_root = current.parents[3]
    candidates = [
        (repo_root / ".env", False),
        (backend_root / ".env", True),
        (Path.cwd() / ".env", True),
    ]
    seen = set()
    for p, override in candidates:
        if p.name == ".env.example":
            continue
        rp = p.resolve()
        if rp in seen or not rp.is_file():
            continue
        seen.add(rp)
        load_dotenv(rp, override=override)


_load_env_files()

logger = logging.getLogger("ecdoctor.agent")

MODEL_FAST = os.getenv("LLM_MODEL_FAST", "gpt-4o-mini")
MODEL_PRO = os.getenv("LLM_MODEL_PRO", "gpt-4o")
MODEL_OMNI = os.getenv("LLM_MODEL_OMNI", "gpt-4o")


def _resolve_openai_base_url() -> Optional[str]:
    raw = (os.getenv("OPENAI_BASE_URL") or "").strip()
    if raw.startswith("sk-") and len(raw) > 30:
        logger.warning("OPENAI_BASE_URL looks like API key")
        raw = ""
    return raw.rstrip("/") if raw else None


def _get_client():
    import httpx
    from openai import AsyncOpenAI
    http_client = httpx.AsyncClient(
        proxy=None,
        trust_env=False,
        timeout=httpx.Timeout(120.0, connect=30.0),
    )
    return AsyncOpenAI(
        api_key=os.getenv("OPENAI_API_KEY", ""),
        base_url=_resolve_openai_base_url(),
        http_client=http_client,
    )


def _normalize_llm_output_for_json(raw: str) -> str:
    """Remove reasoning model think prefixes to avoid JSON parse issues."""
    t = str(raw).strip()
    markers = ["</redacted_reasoning>", "</redacted_thinking>", "]]>"]
    for marker in markers:
        idx = t.find(marker)
        if idx != -1:
            t = t[idx + len(marker):].strip()
            break
    if not t.startswith("{") and "{" in t:
        t = t[t.index("{"):]
    if not t.endswith("}") and "}" in t:
        t = t[: t.rindex("}") + 1]
    # Remove markdown code fence
    m = re.match(r"^```(?:json)?\\s*\\n?(.*?)\\n?\\s*```$", t, re.DOTALL | re.I)
    t = m.group(1).strip() if m else t
    return t


class BaseAgent:
    """Agent 基类：prompt 管理、LLM 调用、JSON 解析"""

    name: str = "base"
    model: str = MODEL_PRO

    def __init__(self, **kwargs):
        self._client = kwargs.get("_client") or _get_client()
        self._extra = kwargs

    def system_prompt(self, ctx: dict) -> str:
        raise NotImplementedError

    def user_prompt(self, ctx: dict) -> str:
        raise NotImplementedError

    async def run(self, ctx: dict) -> dict:
        from openai import NotGiven
        messages = [
            {"role": "system", "content": self.system_prompt(ctx)},
            {"role": "user", "content": self.user_prompt(ctx)},
        ]
        resp = await self._client.chat.completions.create(
            model=self.model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        text = resp.choices[0].message.content or "{}"
        normalized = _normalize_llm_output_for_json(text)
        try:
            data = json.loads(normalized)
        except json.JSONDecodeError:
            logger.warning("[%s] JSON parse failed, returning raw", self.name)
            data = {"raw_output": text}
        return {"agent": self.name, "model": self.model, "data": data}
