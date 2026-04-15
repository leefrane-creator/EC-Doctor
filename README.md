<p align="center">
  <h1>EC Doctor 🩺</h1>
  <strong>电商商品详情页 AI 诊断系统</strong><br>
  5 位专家并行分析 · 一键生成优化报告 · 提升转化率 15-25%
</p>

<p align="center">
  <a href="#功能特性">功能</a> •
  <a href="#架构设计">架构</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#5位诊断专家">专家</a> •
  <a href="#demo-效果">Demo</a> •
  <a href="#技术栈">技术栈</a>
</p>

---

## 功能特性

- **5 位专家并行诊断** — UI/UX、文案、运营、竞品、合规五维同步分析，一次请求拿到完整报告
- **3 种诊断模式** — 完整诊断（5 专家）/ 快速扫描（3 专家）/ 合规检查（风控专项）
- **结构化评分体系** — 总分 + 六维雷达图 + 每位专家独立打分，数据驱动优化决策
- **P0/P1/P2 分级建议** — 按优先级排序优化项，改写前后对比一目了然
- **专家辩论机制** — 自动识别共识与分歧，输出高亮辩论要点
- **Demo 模式** — 无需 API Key 即可体验完整流程，内置真实案例 Mock 数据
- **多模型支持** — 兼容 OpenAI / DeepSeek / 小米 MiMo 等所有 OpenAI 接口

## 架构设计

```
ec-doctor/
├── backend/                        # FastAPI 后端
│   ├── app/
│   │   ├── agents/                 # 5 位电商诊断 Agent
│   │   │   ├── base_agent.py       # 基类：LLM 调用 + JSON 解析
│   │   │   ├── ui_ux_agent.py      # 👁️ UI/UX 视觉体验官
│   │   │   ├── copywriting_agent.py # ✍️ 转化文案策划师
│   │   │   ├── operations_agent.py  # 📊 运营策略顾问
│   │   │   ├── competitor_agent.py  # 🎯 竞品对标分析师
│   │   │   └── compliance_agent.py  # ⚖️ 合规风控审查员
│   │   ├── models/schemas.py        # Pydantic 数据模型
│   │   ├── api/v1.py                # REST API 路由
│   │   └── main.py                  # FastAPI 入口 (端口 8100)
│   └── requirements.txt
│
├── frontend/                        # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.tsx                  # 主应用（含 Demo Mock 数据）
│   │   └── components/
│   │       ├── DiagnoseForm.tsx     # 诊断表单（模式选择 + 商品录入）
│   │       ├── ReportView.tsx       # 报告展示（总分 + 专家卡片 + 建议）
│   │       ├── LoadingScreen.tsx    # 加载动画（专家头像 + 进度条）
│   │       └── Header.tsx           # 顶部导航栏
│   └── ...
│
├── package.json
└── .gitignore
```

### 诊断流程

```
商品信息输入 → 5 Agent 并行调用 LLM → 结构化解析 → 裁决综合排序 → 输出报告
                    ↓                              ↓
            [各司其职互不干扰]              [P0/P1/P2分级]
```

## 快速开始

### 方式一：Demo 模式（推荐，无需 API Key）

```bash
# 克隆仓库
git clone https://github.com/leefrane-creator/EC-Doctor.git
cd EC-Doctor/frontend

# 安装依赖并启动
npm install
npm run dev
```

打开 http://localhost:3000，点击 **「Demo 效果」** 按钮即可查看完整诊断报告。

### 方式二：完整后端模式

```bash
# 1. 后端配置
cd backend
cp .env.example .env
# 编辑 .env，填入你的 OpenAI 兼容 API Key：
# OPENAI_API_KEY=sk-your-key-here
# OPENAI_BASE_URL=https://api.openai.com/v1  # 或 DeepSeek 等兼容接口

# 2. 安装 Python 依赖
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 3. 启动后端
uvicorn app.main:app --host 0.0.0.0 --port 8100 --reload

# 4. 启动前端（新终端）
cd frontend
npm install
npm run dev
```

打开 http://localhost:3000，输入任意商品信息即可获得真实 AI 诊断结果。

## 5 位诊断专家

| 专家 | 视角 | 核心关注点 | 输出内容 |
|------|------|-----------|---------|
| **UI/UX 视觉体验官** | 用户前 8 秒浏览 | 首屏冲击力、视觉层级、CTA 显眼度、移动端适配 | 首屏印象评分 / 层级问题清单 / 改版建议 |
| **转化文案策划师** | 销售心理旅程 | 标题吸引力、卖点场景化、信任背书构建、SEO 关键词 | 标题改写方案 / 卖点重写 / 信任元素建议 |
| **运营策略顾问** | GMV 数据驱动 | 漏斗转化率、定价策略、AOV 提升、活动策划 | 漏斗分析 / 促销策略组合 / 配套推荐 |
| **竞品对标分析师** | 竞品差异化 | SWOT 分析、市场卡位、USP 提炼、价格带定位 | 竞品对比表 / 差异化口号建议 |
| **合规风控审查员** | 法务风险规避 | 违禁词检测、广告法合规、平台规则审查 | 风险词汇清单 / 合规修改建议 |

## Demo 效果

### 诊断输入示例

```
商品：【官方旗舰】2024新款轻薄笔记本电脑 14英寸 i7-1360P 32G+1T 高色域屏 长续航办公本
价格：¥5,999（原价 ¥7,999）
平台：淘宝
```

### 诊断结果预览

| 维度 | 得分 | 等级 | 主要发现 |
|------|------|------|---------|
| **综合评分** | **62** | **B-** | 基础尚可但多维度有优化空间 |
| UI/UX | 58 | C+ | 首屏缺主视觉、CTA 不醒目 |
| 转化文案 | 55 | C | 零信任元素、无场景化文案 |
| 运营策略 | 68 | B- | 加购率仅 8%，AOV 有提升空间 |
| 竞品对标 | 64 | B- | USP 不够锐利，32G 是核心差异点 |
| 合规风控 | 42 | D | "官方旗舰"用词违规风险高 |

### P0 优先级建议（部分）

- **首屏缺主视觉冲击** — 增加场景化 hero 图 + 10 字价值主张标语
- **CTA 按钮不醒目** — 悬浮固定在首屏右下角 + 微动效
- **零信任元素** — 添加销量徽章、好评率、退换货保障标识
- **"官方旗舰"用词风险** — 立即替换为"品牌直供"
- **加购率仅 8%** — 详情页中段插入限时福利锚点

### 改写对比示例

| 类型 | 原文 | AI 改写 |
|------|------|---------|
| 主标题 | 【官方旗舰】2024新款轻薄笔记本电脑 14英寸 i7-1360P... | **轻薄本里的性能怪兽 —— 1.28kg 携带 13 代 i7 + 32G 大内存** |
| 卖点 | 13代i7高性能处理器 | **性能释放不设限 —— 12 核 16 线程，编译/渲染/多任务轻松拿捏** |
| 卖点 | 12小时长续航 | **全天不用找插座 —— 出门告别电源线** |
| 合规 | 【官方旗舰】2024新款... | **【品牌直供】2024款...** |

## API 接口

### POST `/api/v1/diagnose` — 发起诊断

**Request:**
```json
{
  "product_info": {
    "title": "商品标题",
    "price": 5999,
    "platform": "淘宝",
    "description": "详情描述文本...",
    "selling_points": ["卖点1", "卖点2"]
  },
  "mode": "full"
}
```

**Response:**
```json
{
  "task_id": "task_xxx",
  "overall_score": 62,
  "grade": "B-",
  "summary": "综合评估摘要...",
  "agents": [
    { "agent_name": "...", "score": 58, "data": {...} }
  ],
  "p0_count": 6,
  "p1_count": 8,
  "p2_count": 7,
  "top_suggestions": [...]
}
```

**支持模式:** `full`(5专家) | `quick`(3专家) | `compliance_only`(仅风控)

## 技术栈

| 层 | 技术 |
|---|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS 4 + 自定义深色主题 |
| UI 图标 | Lucide React |
| 后端框架 | FastAPI + Pydantic |
| LLM 调用 | OpenAI SDK（兼容 DeepSeek/MiMo 等） |
| 异步运行 | asyncio 并行 Agent 执行 |

## 项目灵感

本项目架构参考 [NoteRx](https://github.com/) 处方审核系统的多 Agent 并行诊断模式，将医疗领域的处方审核方法论迁移至电商详情页优化场景。

## License

MIT

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/leefrane-creator">leefrane-creator</a></sub>
</p>
