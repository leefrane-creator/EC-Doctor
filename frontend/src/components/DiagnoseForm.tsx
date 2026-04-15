import { useState } from 'react'
import { Search, Zap, Shield } from 'lucide-react'

interface Props {
  onSubmit: (data: any) => void
}

const MODES = [
  { key: 'full', label: '完整诊断', desc: '5 位专家全面分析', icon: Search, color: 'from-blue-500 to-indigo-600' },
  { key: 'quick', label: '快速扫描', desc: '3 专家核心诊断', icon: Zap, color: 'from-amber-500 to-orange-600' },
  { key: 'compliance_only', label: '合规检查', desc: '风控专项审查', icon: Shield, color: 'from-emerald-500 to-teal-600' },
]

function DiagnoseForm({ onSubmit }: Props) {
  const [mode, setMode] = useState('full')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [platform, setPlatform] = useState('通用')
  const [description, setDescription] = useState('')
  const [sellingPoints, setSellingPoints] = useState('')

  const handleSubmit = () => {
    if (!title.trim()) return alert('请输入商品标题')
    onSubmit({
      title: title.trim(),
      price: price ? parseFloat(price) : null,
      original_price: null,
      brand: '',
      category: '',
      platform,
      images: [],
      description: description.trim(),
      selling_points: sellingPoints.split('\\n').map(s => s.trim()).filter(Boolean),
      specifications: {},
    })
  }

  const handleDemo = () => {
    onSubmit({
      title: '【官方旗舰】2024新款轻薄笔记本电脑 14英寸 i7-1360P 32G+1T 高色域屏 长续航办公本',
      price: 5999,
      original_price: 7999,
      platform: '淘宝',
      category: '数码/电脑整机',
      images: [],
      description: '搭载第13代英特尔酷睿i7处理器，32GB大内存，1TB固态硬盘。2.8K高色域屏幕，100% sRGB色域覆盖。全金属机身仅重1.28kg。支持65W快充，续航可达12小时。',
      selling_points: ['13代i7高性能处理器', '32G+1T超大存储', '2.8K高刷护眼屏', '1.28kg超轻全金属机身', '12小时长续航'],
      specifications: {},
    })
  }

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <section className="card-glass p-5">
        <h2 className="text-base font-semibold mb-3">选择诊断模式</h2>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map(m => {
            const Icon = m.icon
            const active = mode === m.key
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  active
                    ? `border-blue-500/50 bg-gradient-to-br ${m.color} shadow-lg`
                    : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
                <p className={`text-sm font-semibold mt-2 ${active ? 'text-white' : 'text-slate-300'}`}>{m.label}</p>
                <p className={`text-xs mt-0.5 ${active ? 'text-white/70' : 'text-slate-500'}`}>{m.desc}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* 商品信息录入 */}
      <section className="card-glass p-5 space-y-4">
        <h2 className="text-base font-semibold">商品信息</h2>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">商品标题 *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="输入商品完整标题..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">价格（元）</label>
            <input
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="5999"
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">平台</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {['通用', '淘宝', '天猫', '京东', '拼多多', '抖音', '小红书'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">详情描述</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="粘贴商品详情文案内容..."
            rows={4}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">卖点列表（每行一个）</label>
          <textarea
            value={sellingPoints}
            onChange={e => setSellingPoints(e.target.value)}
            placeholder={'核心卖点1\\n核心卖点2\\n核心卖点3'}
            rows={3}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>
      </section>

      {/* 按钮 */}
      <div className="flex gap-3">
        <button onClick={handleSubmit} className="btn-primary flex-1 text-white">
          开始诊断
        </button>
        <button onClick={handleDemo} className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm">
          Demo 效果
        </button>
      </div>
    </div>
  )
}
export default DiagnoseForm
