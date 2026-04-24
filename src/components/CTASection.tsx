import type { RefObject } from 'react'

interface CTASectionProps {
  showContactInfo: boolean
  contactRef: RefObject<HTMLDivElement | null>
  onBookConsultation: () => void
}

export default function CTASection({
  showContactInfo,
  contactRef,
  onBookConsultation,
}: CTASectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <section className="section-shell ink-gradient p-8 text-white sm:p-10">
        <p className="eyebrow text-sky-200">Step 4</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          想拿到更完整的 7 天出海商业化诊断？
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
          免费初判只能回答“值不值得继续看”，完整诊断才会进一步拆解真实竞品、价格带、利润空间、渠道打法和进入风险，帮助你判断要不要真正投入预算。
        </p>

        <button
          type="button"
          onClick={onBookConsultation}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-50"
        >
          预约完整诊断
        </button>
      </section>

      <div ref={contactRef} className="section-shell p-6 sm:p-8">
        <p className="eyebrow">Contact Block</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          线索转化占位区
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          当前先用占位信息模拟咨询入口。后续可以直接替换成企业微信二维码、飞书表单、Calendly、Tally 或客服组件。
        </p>

        {showContactInfo ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                微信咨询
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                Nicheboi-Consult
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                电话咨询
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                +86 000-0000-0000
              </p>
            </div>
            <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
              这块目前是前端占位文案。后续接真实销售流程时，只需要替换这里的按钮事件或联系方式组件。
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            点击左侧按钮后，这里会展开微信/电话占位信息，并自动滚动到该区域。
          </div>
        )}
      </div>
    </div>
  )
}
