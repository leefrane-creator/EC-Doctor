"""
EC Doctor 请求/响应 Pydantic 模型
"""
from pydantic import BaseModel, Field
from typing import Optional


class ProductInfo(BaseModel):
    """商品基础信息"""
    title: str = Field(description="商品标题")
    price: Optional[float] = Field(default=None, description="当前价格")
    original_price: Optional[float] = Field(default=None, description="原价/划线价")
    brand: Optional[str] = Field(default=None, description="品牌名")
    category: Optional[str] = Field(default=None, description="类目")
    platform: str = Field(default="通用", description="平台：淘宝/京东/抖音/拼多多/通用")
    images: list[str] = Field(default_factory=list, description="图片 URL 列表")
    description: str = Field(default="", description="详情文本内容")
    selling_points: list[str] = Field(default_factory=list, description="卖点列表")
    specifications: dict = Field(default_factory=dict, description="规格参数")
    sales_count: Optional[int] = Field(default=None, description="销量")
    rating: Optional[float] = Field(default=None, description="评分")
    review_count: Optional[int] = Field(default=None, description="评价数")
    extra_data: dict = Field(default_factory=dict, description="扩展数据")


class DiagnoseRequest(BaseModel):
    """诊断请求"""
    product_info: ProductInfo
    user_id: Optional[str] = Field(default=None, description="用户 ID")
    mode: str = Field(default="full", description="诊断模式：full/quick/compliance_only")
    competitor_info: Optional[dict] = Field(default=None, description="可选的竞品信息")


class AgentResult(BaseModel):
    """单个 Agent 结果"""
    agent_name: str
    score: float
    data: dict
    latency_ms: int


class DiagnoseResponse(BaseModel):
    """诊断响应"""
    task_id: str
    overall_score: float
    grade: str  # A/B/C/D/E
    summary: str
    agents: list[AgentResult]
    p0_count: int
    p1_count: int
    p2_count: int
    top_suggestions: list[dict]
    raw_report: dict
