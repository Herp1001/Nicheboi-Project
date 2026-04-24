interface HeroProps {
  onStart: () => void
  onViewSample: () => void
}

const toolHighlights = [
  '输入产品基础信息，2-3 秒生成初步报告',
  '优先覆盖智能硬件、消费电子、制造与 3C 场景',
  '先判断方向，再决定是否进入 7 天完整诊断',
]

const workflowSteps = [
  {
    step: '01',
    title: '录入基础信息',
    description: '输入市场、平台、价格带和当前卡点。',
  },
  {
    step: '02',
    title: '自动生成初判',
    description: '使用前端规则引擎输出市场与竞品判断。',
  },
  {
    step: '03',
    title: '引导下一步转化',
    description: '把方向问题收敛成可继续深挖的商业线索。',
  },
]

export default function Hero({ onStart, onViewSample }: HeroProps) {
  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="section-shell overflow-hidden">
          <div className="ink-gradient p-8 text-white sm:p-10">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-sky-100">
              B2B Lead Tool MVP
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              输入产品信息，自动生成一份出海竞品初判报告
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              适合智能硬件、消费电子、制造企业，用于快速判断目标市场、平台、价格带和竞争风险。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onStart}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-50"
              >
                开始生成报告
              </button>
              <button
                type="button"
                onClick={onViewSample}
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                查看示例报告
              </button>
            </div>
            <div className="mt-4">
              <p className="max-w-xl text-sm leading-6 text-slate-300">
                这不是完整市场调研，而是一个快速决策工具。它帮助企业在投入代运营、广告费、样品和团队之前，先判断方向是否值得继续。
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-200/80 p-6 sm:grid-cols-3 sm:p-8">
            {toolHighlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <aside className="section-shell p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Tool Flow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                专业工具首屏
              </h2>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 font-mono text-xs text-sky-800">
              Demo Ready
            </span>
          </div>

          <div className="mt-8 space-y-4">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="font-mono text-xs tracking-[0.28em] text-sky-700">
                  Step {item.step}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
