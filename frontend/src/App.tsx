import { useState } from 'react'
import Header from './components/Header'
import DiagnoseForm from './components/DiagnoseForm'
import ReportView from './components/ReportView'
import LoadingScreen from './components/LoadingScreen'

export interface AgentResultData {
  agent_name: string
  score: number
  data: Record<string, any>
  latency_ms: number
}

export interface TopSuggestion {
  agent: string
  priority: string
  issue: string
  suggestion: string
}

export interface ReportData {
  task_id: string
  overall_score: number
  grade: string
  summary: string
  agents: AgentResultData[]
  p0_count: number
  p1_count: number
  p2_count: number
  top_suggestions: TopSuggestion[]
  raw_report: Record<string, any>
}

/** Mock 数据 — 后端不可用时自动使用 */
const MOCK_REPORT: ReportData = {
  task_id: 'demo-ec-001',
  overall_score: 62,
  grade: 'B-',
  summary: '该商品详情页在基础信息呈现和卖点覆盖上表现尚可，但在视觉层级、转化文案、信任背书、竞品差异化及合规风险五个维度存在明显优化空间。首屏缺乏冲击力强的主视觉和明确价值主张，CTA 按钮不够突出；文案偏功能罗列而缺少场景化叙事和痛点共鸣；未利用社会证明和权威背书构建购买信心；与同类竞品相比 USP 不够锐利；同时存在多处可能触发平台违规的敏感词表述。综合建议按 P0→P1→P2 优先级逐步迭代，预计优化后转化率可提升 15-25%。',
  agents: [
    {
      agent_name: 'UI/UX 视觉体验官',
      score: 58,
      latency_ms: 1200,
      data: {
        first_impression: '首屏信息密度过高，用户 3 秒内无法抓住核心卖点。标题堆砌参数但缺少情感化主标语。',
        visual_hierarchy: '层级混乱：价格、优惠标签、卖点、规格混排，没有清晰的 Z 型或 F 型阅读动线。',
        cta_analysis: '"立即购买"按钮位置在下部折叠区，首屏不可见；按钮颜色与正文对比度不足。',
        mobile_review: '移动端适配差：图片未做响应式裁切，文字在 375px 屏幕上行过长导致阅读疲劳。',
        suggestions: [
          { priority: 'P0', issue: '首屏缺主视觉冲击', suggestion: '增加一张场景化 hero 图（产品+使用场景），配一句 10 字以内价值主张标语' },
          { priority: 'P0', issue: 'CTA 按钮不醒目', suggestion: '将主 CTA 固定在首屏右下角悬浮，用品牌色 + 微动效吸引点击' },
          { priority: 'P1', issue: '信息层级混乱', suggestion: '采用「标题 → 价格(大字) → 短卖点(图标) → 详情」的四层结构' },
          { priority: 'P2', issue: '移动端体验差', suggestion: '图片限制最大高度 300px，关键信息卡片化呈现' },
        ],
        rewritten_copy: [
          { original: '【官方旗舰】2024新款轻薄笔记本电脑 14英寸 i7-1360P 32G+1T 高色域屏 长续航办公本', improved: '轻薄本里的性能怪兽 —— 1.28kg 携带 13 代 i7 + 32G 大内存，办公创作两不误' },
          { original: '搭载第13代英特尔酷睿i7处理器，32GB大内存，1TB固态硬盘', improved: '打开 50 个网页也不卡 —— 32GB 内存 + 1TB 极速固态，多任务如丝般顺滑' },
        ],
      },
    },
    {
      agent_name: '转化文案策划师',
      score: 55,
      latency_ms: 1500,
      data: {
        seo_keywords: ['轻薄笔记本推荐', 'i7 笔记本电脑', '办公笔记本', '长续航电脑'],
        headline_analysis: '当前标题为关键词堆砌型（"官方旗舰"+"新款"+"i7-1360P"+"高色域屏"+"长续航"），虽然 SEO 覆盖面广但缺乏点击吸引力，无法在搜索结果中脱颖而出。',
        selling_points_rewrite: [
          { original: '13代i7高性能处理器', improved: '性能释放不设限 —— 12 核 16 线程，编译/渲染/多任务轻松拿捏' },
          { original: '32G+1T超大存储', improved: '告别空间焦虑 —— 32G 内存流畅运行 + 1TB 存放 5 万张照片不心疼' },
          { original: '2.8K高刷护眼屏', improved: '眼睛不再酸累 —— 2.8K 分辨率 + DC 调光，加班追剧都舒服' },
          { original: '1.28kg超轻全金属机身', improved: '轻到像没带 —— 单手可托起，通勤出差肩膀零负担' },
          { original: '12小时长续航', improved: '全天不用找插座 —— 本地视频播放实测 12 小时，出门告别电源线' },
        ],
        trust_building: '完全缺失！没有：用户评价摘要、销量数据、认证标志、售后保障说明、品牌故事',
        pain_point_coverage: '文案全程在讲"有什么"，从没说"对你有什么好处"。缺少场景代入（"每天背着电脑挤地铁的你"、"经常开 20 个浏览器 tab 的运营人"）',
        suggestions: [
          { priority: 'P0', issue: '零信任元素', suggestion: '添加销量徽章（"已售 5000+"）、好评率、退换货保障标识、30 天价保标签' },
          { priority: 'P0', issue: '无场景化文案', suggestion: '每个卖点加一句话场景描述："出差党早上 8 点到晚上 8 点，全程不充电"' },
          { priority: 'P1', issue: '标题缺乏吸引力', suggestion: '改为问题式或数字式："为什么 90% 的程序员都换上了这台 1.28kg 的轻薄本？"' },
          { priority: 'P2', issue: 'SEO 关键词未融入正文', suggestion: '在前 200 字自然融入 "轻薄笔记本推荐"、"办公笔记本" 等长尾词' },
        ],
        rewritten_copy: [],
      },
    },
    {
      agent_name: '运营策略顾问',
      score: 68,
      latency_ms: 1300,
      data: {
        funnel_analysis: '当前详情页漏斗估算：访问 → 浏览 3 页以上(65%) → 加购(8%) → 下单(3%) → 支付(2.5%)。核心流失在"浏览→加购"环节，用户看了详情但没有足够冲动加入购物车。',
        price_positioning: '5999 元定价处于 14 寸轻薄本主流价位带（4000-8000），对标联想小新 Pro 14（5499）和惠普星 Book Pro 14（5799）。原价 7999 打 75 折的策略合理，但折扣力度感知不强。',
        promotion_strategy: [
          '限时策略：整点/整半点抢限量 100 台额外减 200',
          '捆绑策略：+99 元换购原价 299 元的电脑包+鼠标套装',
          '分期策略：支持 24 期免息（日均约 8.3 元）',
          '会员策略：店铺会员下单再送延保 3 个月',
        ],
        aov_upsell: '当前 AOV 约 6100 元（含少量配件）。建议：配件套餐（电脑包+鼠标+支架=399）、软件套装（Office 365 年卡）、延长保修服务包（2 年 399 元）。目标提升 AOV 至 6800 元。',
        suggestions: [
          { priority: 'P0', issue: '加购率仅 8%', suggestion: '在详情页中段插入"限时福利"锚点：倒计时 + 限量 + 立即加购浮层' },
          { priority: 'P1', issue: '折扣力度感知弱', suggestion: '将"原价 7999"做大划线，旁边标注"省 2000 元"而非简单的 75 折' },
          { priority: 'P1', issue: 'AOV 提升空间大', suggestion: '底部设置"聪明买家都在买"配件组合区，默认勾选' },
          { priority: 'P2', issue: '缺少复购引导', suggestion: '确认页推送："关注店铺领 50 元券，下次购买直接抵扣"' },
        ],
        rewritten_copy: [],
      },
    },
    {
      agent_name: '竞品对标分析师',
      score: 64,
      latency_ms: 1400,
      data: {
        competitors: [
          { name: '联想小新 Pro 14 2024', price: 5499, strengths: ['品牌认知度高', '线下渠道广', '售后网点多'], weaknesses: ['接口少（仅 USB-C）', '屏幕亮度偏低'] },
          { name: '惠普星 Book Pro 14', price: 5799, strengths: ['外观设计精致', '键盘手感好'], weaknesses: ['散热一般', '续航不如标称'] },
          { name: '荣耀 MagicBook X14 Pro', price: 4699, strengths: ['性价比极高', '生态互联好'], weaknesses: ['做工质感差', '屏幕素质一般'] },
        ],
        swot: {
          strengths: ['1.28kg 超轻机身领先同级', '32G 内存是同价位唯一', '12 小时续航实测优秀'],
          weaknesses: ['新品牌知名度低', '线上渠道单一', '无实体门店'],
          opportunities: ['远程办公需求增长', '大学生开学季', '企业集采市场'],
          threats: ['头部品牌降价促销', '芯片供应波动影响产能', '消费者支出收缩'],
        },
        market_positioning: '定位"高配置性价比之选"，主打"同价位最高配"。建议强化"32G 内存碾压同级"这一差异化点，因为竞品普遍只给 16G。',
        usp_suggestions: [
          'USP 方向一："同价位唯一 32G —— 别人的顶配只是我们的起步"',
          'USP 方向二："比联想轻 200g，比惠普便宜 500，比荣耀强一个档次"',
          'USP 方向三："程序员的本命机 —— 编译快、携带轻、续航久"',
        ],
        suggestions: [
          { priority: 'P0', issue: 'USP 不够锐利', suggestion: '选一个最强差异点（32G 同级唯一）做成首屏核心口号' },
          { priority: 'P1', issue: '竞品对比表缺失', suggestion: '添加参数对比表格，突出自身优势项（内存/重量/续航）' },
          { priority: 'P2', issue: '品牌信任度低', suggestion: '引入 KOL/KOC 评测内容或媒体测评链接增强可信度' },
          { priority: 'P2', issue: '市场卡位模糊', suggestion: '明确目标人群画像（如"25-35 岁技术从业者"）并针对性调整文案语气' },
        ],
        rewritten_copy: [],
      },
    },
    {
      agent_name: '合规风控审查员',
      score: 42,
      latency_ms: 1100,
      data: {
        risk_level: 'HIGH',
        violation_words: [
          { word: '官方旗舰', risk: '中', reason: '非授权渠道使用"官方"涉嫌虚假宣传，平台可能判违规', suggestion: '改为"品牌直供"或删除该词' },
          { word: '新款', risk: '低', reason: '若无明确上市时间佐证，"新款"可能被认定为时效性误导', suggestion: '改为具体年份"2024款"或删除' },
          { word: '最长/最佳', risk: '高', reason: '《广告法》禁止绝对化用语，若后续添加此类词将被重罚', suggestion: '避免使用所有极限词' },
        ],
        platform_rules: {
          taobao: '标题超 30 字可能导致降权；价格需与实际一致否则虚假宣传扣分',
          jd: '需提供 3C 认证编号；"旗舰"一词需要品牌授权证明',
          pdd: '低价引流商品容易被系统判定异常；需注意价格区间一致性',
        },
        advertising_law_check: '需确保：1) 价格真实（原价需有历史成交记录）；2) 参数有据可查（CPU 型号/屏幕参数）；3) 无"第一""最""顶级"等绝对化用语；4) 促销活动符合平台规范',
        suggestions: [
          { priority: 'P0', issue: '"官方旗舰"用词风险', suggestion: '立即替换为合规表述，避免平台处罚扣分或下架' },
          { priority: 'P0', issue: '价格真实性存疑', suggestion: '确保 7999 原价有 30 天以上历史成交记录，否则违反《价格法》' },
          { priority: 'P1', issue: '缺少资质展示', suggestion: '补充 3C 认证编号、能效等级标识等强制性信息' },
          { priority: 'P2', issue: '未建立合规检查流程', suggestion: '建议上线前通过平台自检工具或第三方合规检测服务扫描' },
        ],
        rewritten_copy: [
          { original: '【官方旗舰】2024新款轻薄笔记本电脑', improved: '【品牌直供】2024款轻薄笔记本电脑' },
        ],
      },
    },
  ],
  p0_count: 6,
  p1_count: 8,
  p2_count: 7,
  top_suggestions: [
    { agent: 'UI/UX 视觉体验官', priority: 'P0', issue: '首屏缺主视觉冲击', suggestion: '增加一张场景化 hero 图（产品+使用场景），配一句 10 字以内价值主张标语' },
    { agent: 'UI/UX 视觉体验官', priority: 'P0', issue: 'CTA 按钮不醒目', suggestion: '将主 CTA 固定在首屏右下角悬浮，用品牌色 + 微动效吸引点击' },
    { agent: '转化文案策划师', priority: 'P0', issue: '零信任元素', suggestion: '添加销量徽章（"已售 5000+"）、好评率、退换货保障标识、30 天价保标签' },
    { agent: '转化文案策划师', priority: 'P0', issue: '无场景化文案', suggestion: '每个卖点加一句话场景描述："出差党早上 8 点到晚上 8 点，全程不充电"' },
    { agent: '运营策略顾问', priority: 'P0', issue: '加购率仅 8%', suggestion: '在详情页中段插入"限时福利"锚点：倒计时 + 限量 + 立即加购浮层' },
    { agent: '合规风控审查员', priority: 'P0', issue: '"官方旗舰"用词风险', suggestion: '立即替换为合规表述，避免平台处罚扣分或下架' },
    { agent: '合规风控审查员', priority: 'P0', issue: '价格真实性存疑', suggestion: '确保 7999 原价有 30 天以上历史成交记录，否则违反《价格法》' },
  ],
  raw_report: {},
}

function App() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'form' | 'report'>('form')
  const [useMock, setUseMock] = useState(true)

  const handleDiagnose = async (productInfo: any) => {
    setLoading(true)
    setReport(null)
    try {
      let data: ReportData

      if (useMock) {
        // Demo 模式：模拟网络延迟后返回 Mock 数据
        console.log('[EC Doctor] Demo 模式，使用 Mock 数据')
        await new Promise(resolve => setTimeout(resolve, 2500))
        data = MOCK_REPORT
      } else {
        // 正式模式：调用后端 API
        const res = await fetch('/api/v1/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_info: productInfo,
            mode: 'full',
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        data = await res.json()
      }

      setReport(data)
      setActiveTab('report')
    } catch (err: any) {
      // API 失败时自动回退 Mock 数据
      console.warn('[EC Doctor] API 调用失败，回退到 Mock 数据:', err.message)
      alert('后端未连接，正在使用 Demo 模式展示效果')
      setUseMock(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReport(MOCK_REPORT)
      setActiveTab('report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header onReset={() => { setReport(null); setActiveTab('form') }} hasResult={!!report} />

      <main className="max-w-5xl mx-auto px-4 pb-20 pt-6">
        {loading ? (
          <LoadingScreen />
        ) : activeTab === 'form' ? (
          <DiagnoseForm onSubmit={handleDiagnose} />
        ) : report ? (
          <ReportView report={report} onBack={() => setActiveTab('form')} />
        ) : null}
      </main>

      {/* Demo 模式指示器 */}
      {useMock && activeTab === 'form' && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-amber-500/30 transition-colors" onClick={() => { setUseMock(!useMock) }}>
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          Demo 模式 · 点击切换正式模式
        </div>
      )}
    </div>
  )
}

export default App
