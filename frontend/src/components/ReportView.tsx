import { ArrowLeft, AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react'

interface Props {
  report: any
  onBack: () => void
}

const AGENT_META: Record<string, { label: string; color: string; icon: string }> = {
  uiux: { label: 'UI/UX 视觉体验', color: 'text-purple-400', icon: '\u{1F441}\uFE0F' },
  copywriting: { label: '转化文案策划', color: 'text-blue-400', icon: '\u270D\uFE0F' },
  operations: { label: '运营策略顾问', color: 'text-amber-400', icon: '\u{1F4CA}' },
  competitor: { label: '竞品对标分析师', color: 'text-emerald-400', icon: '\u{1F3AF}' },
  compliance: { label: '合规风控审查', color: 'text-red-400', icon: '\u2696\uFE0F' },
}

const GRADE_COLOR: Record<string, string> = {
  A: 'text-emerald-400 bg-emerald-400/15',
  B: 'text-green-400 bg-green-400/15',
  C: 'text-amber-400 bg-amber-400/15',
  D: 'text-orange-400 bg-orange-400/15',
  E: 'text-red-400 bg-red-400/15',
}

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3b82f6"
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(score)}</span>
        <span className="text-xs text-slate-500">综合评分</span>
      </div>
    </div>
  )
}

function IssueBadge({ priority }: { priority: string }) {
  if (priority === 'P0') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
        <AlertTriangle size={12}/> P0
      </span>
    )
  }
  if (priority === 'P1') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded">
        <AlertCircle size={12}/> P1
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
      <Info size={12}/> P2
    </span>
  )
}

function ReportView({ report, onBack }: Props) {
  return (
    <div className="space-y-5">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
      >
        <ArrowLeft size={16} /> 返回修改
      </button>

      {/* 总分卡 */}
      <section className="card-glass p-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={report.overall_score} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <h2 className="text-xl font-bold">诊断报告</h2>
            <span className={`px-2.5 py-1 rounded-full text-sm font-bold ${GRADE_COLOR[report.grade] || ''}`}>
              等级 {report.grade}
            </span>
          </div>
          <p className="text-sm text-slate-400">{report.summary}</p>
          <div className="flex gap-4 mt-3 justify-center sm:justify-start text-sm">
            <span className="text-red-400">{report.p0_count} 个严重问题</span>
            <span className="text-amber-400">{report.p1_count} 个中等问题</span>
            <span className="text-blue-400">{report.p2_count} 个优化项</span>
          </div>
        </div>
      </section>

      {/* 各专家评分 */}
      <section className="card-glass p-5">
        <h3 className="text-base font-semibold mb-4">各维度评分</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {report.agents.map((agent: any) => {
            const meta = AGENT_META[agent.agent_name]
            return (
              <div key={agent.agent_name} className="bg-slate-900/60 rounded-xl p-3.5 text-center border border-slate-800/50">
                <div className="text-lg mb-1">{meta?.icon || '\u{1F50D}'}</div>
                <div className="text-xs text-slate-400 mb-1 truncate">{meta?.label || agent.agent_name}</div>
                <div className={`text-2xl font-bold ${meta?.color || 'text-white'}`}>
                  {Math.round(agent.score)}
                </div>
                <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${agent.score}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 核心问题清单 */}
      {(report.top_suggestions?.length > 0) && (
        <section className="card-glass p-5">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-400" /> 核心建议
          </h3>
          <div className="space-y-3">
            {report.top_suggestions.map((item: any, idx: number) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-3.5 border-l-2 border-slate-700 hover:bg-slate-900/80 transition-colors">
                <div className="flex items-start gap-3">
                  <IssueBadge priority={item.priority} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500">
                        {AGENT_META[item.agent]?.label || item.agent}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">{item.issue}</p>
                    {item.suggestion && (
                      <p className="text-xs text-emerald-400/80 mt-1.5 pl-2 border-l-2 border-emerald-500/30">
                        建议：{item.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
export default ReportView
