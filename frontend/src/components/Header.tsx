interface Props {
  onReset: () => void
  hasResult: boolean
}

function Header({ onReset, hasResult }: Props) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold">
            EC
          </div>
          <span className="text-lg font-bold text-white">EC Doctor</span>
          <span className="text-xs text-slate-500 hidden sm:inline ml-1">详情页智能诊断</span>
        </div>
        {hasResult && (
          <button onClick={onReset} className="text-sm text-slate-400 hover:text-white transition-colors">
            新建诊断 &rarr;
          </button>
        )}
      </div>
    </header>
  )
}
export default Header
