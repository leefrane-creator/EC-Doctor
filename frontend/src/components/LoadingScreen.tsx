function LoadingScreen() {
  const agents = ['UI/UX 视觉专家', '转化文案策划', '运营策略顾问', '竞品对标分析师', '合规风控审查员']

  return (
    <div className="card-glass p-12 text-center">
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#3b82f6"
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray="339.292" strokeDashoffset="85"
            style={{ animation: 'spin 2s linear infinite', transformOrigin: 'center' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-400">EC</span>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">正在诊断中...</h3>
      <p className="text-sm text-slate-400 mb-6">多位专家并行分析您的详情页</p>
      <div className="space-y-2 max-w-xs mx-auto text-left">
        {agents.map((a, i) => (
          <div key={a} className="flex items-center gap-2 text-xs text-slate-500">
            <span
              className="w-4 h-4 rounded-full border-2 border-slate-700"
              style={{ animation: `pulse 2s ease-in-out infinite`, animationDelay: `${i * 200}ms` }}
            ></span>
            <span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default LoadingScreen
