interface HeaderProps {
  onStart: () => void
  onViewSample: () => void
}

export default function Header({ onStart, onViewSample }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-2 text-center text-xs text-slate-200 sm:px-6 lg:px-8">
        当前为免费初判工具，适合判断是否值得进入下一步深度诊断，不等同于完整市场调研。
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="eyebrow">Nicheboi Commercialization Lab</p>
          <p className="mt-1 text-sm font-semibold text-slate-950 sm:text-base">
            出海竞品初判工具
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onViewSample}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:text-sky-900"
          >
            示例报告
          </button>
          <button
            type="button"
            onClick={onStart}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-900"
          >
            开始生成报告
          </button>
        </div>
      </div>
    </header>
  )
}
