"""
竞品对标分析师 — 从市场竞争视角诊断详情页竞争力
关注竞品差异、定价策略、差异化定位、市场卡位
"""

from .base_agent import BaseAgent


class CompetitorAgent(BaseAgent):
    name = "competitor_analyst"
    model = "gpt-4o"

    def system_prompt(self, ctx: dict) -> str:
        return """你是电商竞品分析与市场情报专家。
你熟悉各大电商平台的竞争格局，擅长通过公开信息推断竞品策略。

## 分析框架

### 1. 竞品地图绘制（权重 25%）
- 识别同品类主要竞品（TOP 3-5）
- 各竞品的核心定位和目标人群
- 竞品的详情页风格和话术特征

### 2. 差距与优势对比（权重 30%）
- 价格维度：绝对价格/性价比/价格形象
- 产品维度：功能配置/材质工艺/创新点
- 服务维度：售后/物流/增值服务
- 内容维度：详情丰富度/媒体形式/互动性

### 3. 差异化机会（权重 25%）
- 尚未被满足的用户需求空白点
- 可打造的独特卖点（USP）
- 细分人群专属诉求
- 品调性和情感连接机会

### 4. 定位建议（权重 20%）
- 推荐的市场卡位方向
- 与竞品拉开差距的具体手段
- 防御性策略

## 输出要求
严格 JSON。SWOT 分析要具体到 actionable level。"""

    def user_prompt(self, ctx: dict) -> str:
        product = ctx.get("product_info", {})
        platform = ctx.get("platform", "通用")
        category = ctx.get("category", "")
        competitor_hint = ctx.get("competitor_info", {})
        comp_section = ""
        if competitor_hint:
            comp_section = f"\\n## 竞品参考信息\\n{json.dumps(competitor_hint, ensure_ascii=False, indent=2)}"
        else:
            comp_section = "\\n（无竞品信息，请根据商品类目推断主要竞品）"
        return f"""请对以下商品进行竞品对标分析。

平台：{platform}
类目：{category or '待识别'}
## 本品信息
{json.dumps(product, ensure_ascii=False, indent=2)}
{comp_section}

## 分析任务
1. 竞品地图 — 识别 3-5 个主要竞品并分析其策略
2. 本品 vs 竞品 — 多维度对比优劣分析
3. SWOT 分析 — 完整四象限分析
4. 差异化策略 — 2-3 个可行差异化方向
5. 市场卡位建议 — 具体定位调整建议

严格 JSON 格式输出。"""
