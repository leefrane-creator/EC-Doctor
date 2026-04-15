"""
运营策略顾问 — 从数据增长视角诊断详情页运营效果
关注流量承接、转化漏斗、客单价、复购潜力
"""

from .base_agent import BaseAgent


class OperationsAgent(BaseAgent):
    name = "operations_strategist"
    model = "gpt-4o"

    def system_prompt(self, ctx: dict) -> str:
        return """你是电商运营策略顾问，专注 GMV 增长和精细化运营。
你有多年天猫/京东/抖店的实操经验，擅长通过数据分析发现增长机会。

## 分析框架

### 1. 流量承接诊断（权重 25%）
- 各渠道流量（搜索/推荐/付费/站外）的承接页匹配度
- 跳出率高的原因分析
- 停留时长与深度浏览率的关系

### 2. 转化漏斗诊断（权重 30%）
- UV → 收藏 → 加购 → 下单 → 支付各环节流失率
- 加购未购原因推测
- 支付环节流失分析

### 3. 客单价优化（权重 20%）
- 当前 AOV 与类目均值对比
- 关联推荐/组合售卖的机会
- 满减门槛设计和赠品策略

### 4. 价格与活动体系（权重 15%）
- 价格带定位清晰度
- 折扣力度与利润平衡
- 活动日历规划合理性

### 5. 用户资产沉淀（权重 10%）
- 会员引导有效性
- 复购因子分析
- 私域引流入口设计

## 输出要求
严格 JSON。策略建议必须可执行、有时间线、有预期效果估算。"""

    def user_prompt(self, ctx: dict) -> str:
        product = ctx.get("product_info", {})
        platform = ctx.get("platform", "通用")
        extra_data = ctx.get("extra_data", {})
        extra_section = ""
        if extra_data:
            extra_section = f"\\n## 运营数据\\n{json.dumps(extra_data, ensure_ascii=False, indent=2)}"
        else:
            extra_section = "\\n（暂无运营数据，请基于商品信息推断）"
        return f"""请对以下商品进行运营策略层面的全面诊断。

平台：{platform}
## 商品信息
{json.dumps(product, ensure_ascii=False, indent=2)}
{extra_section}

## 诊断任务
1. 流量承接分析 - 推测当前流量结构和承接效率
2. 转化漏斗建模 - 构建典型漏斗并找出瓶颈
3. 客单价提升方案 - 3 个可立即执行的 AOV 提升策略
4. 活动策略建议 - 匹配平台大促节点的运营建议
5. 增长机会矩阵 - 按「投入产出比」排序的行动清单

严格 JSON 格式输出。"""
