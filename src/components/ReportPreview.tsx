import { useEffect, useState, type RefObject } from 'react'

import { formatReportAsPlainText } from '../lib/reportFormatter'
import type { CompetitorInsightReport } from '../types/report'
import ScoreCard from './ScoreCard'

interface ReportPreviewProps {
  report: CompetitorInsightReport
  reportRef: RefObject<HTMLDivElement | null>
  onBookConsultation: () => void
}

const reportSections = [
  { key: 'input', label: '1. 基本输入' },
  { key: 'market', label: '2. 市场需求初判' },
  { key: 'competitor', label: '3. 竞品结构初判' },
  { key: 'pricing', label: '4. 价格带判断' },
  { key: 'channel', label: '5. 渠道打法判断' },
  { key: 'score', label: '6. 五项评分卡' },
  { key: 'conclusion', label: '7. 初步结论' },
]

function formatGeneratedTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', 'true')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export default function ReportPreview({
  report,
  reportRef,
  onBookConsultation,
}: ReportPreviewProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (copyStatus === 'idle') {
      return
    }

    const timer = window.setTimeout(() => {
      setCopyStatus('idle')
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [copyStatus])

  const handleCopyReport = async () => {
    try {
      await copyToClipboard(formatReportAsPlainText(report))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  const handleDownloadPdf = () => {
    window.print()
  }

  return (
    <div ref={reportRef} data-report-print-root>
      <section className="section-shell overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="eyebrow text-sky-200">Step 3</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {report.title}
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                生成时间：{formatGeneratedTime(report.generatedAt)}
              </div>
              <button
                type="button"
                onClick={handleCopyReport}
                className="print-hidden rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                {copyStatus === 'copied'
                  ? '已复制报告'
                  : copyStatus === 'error'
                    ? '复制失败，请重试'
                    : '复制报告'}
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="print-hidden rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-50"
              >
                下载为PDF
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {reportSections.map((section) => (
              <span
                key={section.key}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {section.label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8 px-4 py-8 sm:px-8 sm:py-10">
          <section>
            <p className="eyebrow">1. 基本输入</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  产品名称
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {report.basicInput.productName}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  目标市场
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {report.basicInput.targetMarket}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  目标平台
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {report.basicInput.targetPlatform}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  价格带
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {report.basicInput.targetPriceBand}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p className="eyebrow">2. 市场需求初判</p>
            <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6">
              <p className="text-sm leading-7 text-slate-700 sm:text-base">
                {report.marketDemandAssessment}
              </p>
            </div>
          </section>

          <section>
            <p className="eyebrow">3. 竞品结构初判</p>
            <div className="mt-4 space-y-4 lg:hidden">
              {report.competitorStructure.map((item) => (
                <article
                  key={item.competitorType}
                  className="rounded-[28px] border border-slate-200 bg-white p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-950">
                    {item.competitorType}
                  </h3>
                  <dl className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                    <div>
                      <dt className="font-semibold text-slate-900">可能价格带</dt>
                      <dd className="mt-1">{item.possiblePriceRange}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">典型卖点</dt>
                      <dd className="mt-1">{item.typicalSellingPoints}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">用户关注点</dt>
                      <dd className="mt-1">{item.userFocus}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">
                        对新品牌的启示
                      </dt>
                      <dd className="mt-1">{item.implicationForNewBrand}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto rounded-[28px] border border-slate-200 bg-white lg:block">
              <table className="min-w-[980px] divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">竞品类型</th>
                    <th className="px-6 py-4 font-semibold">可能价格带</th>
                    <th className="px-6 py-4 font-semibold">典型卖点</th>
                    <th className="px-6 py-4 font-semibold">用户关注点</th>
                    <th className="px-6 py-4 font-semibold">对新品牌的启示</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm leading-6 text-slate-700">
                  {report.competitorStructure.map((item) => (
                    <tr key={item.competitorType} className="align-top">
                      <td className="px-6 py-5 font-semibold text-slate-950">
                        {item.competitorType}
                      </td>
                      <td className="px-6 py-5">{item.possiblePriceRange}</td>
                      <td className="px-6 py-5">{item.typicalSellingPoints}</td>
                      <td className="px-6 py-5">{item.userFocus}</td>
                      <td className="px-6 py-5">
                        {item.implicationForNewBrand}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section>
              <p className="eyebrow">4. 价格带判断</p>
              <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6">
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  {report.priceAssessment}
                </p>
              </div>
            </section>

            <section>
              <p className="eyebrow">5. 渠道打法判断</p>
              <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6">
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  {report.channelStrategy}
                </p>
              </div>
            </section>
          </div>

          <section>
            <p className="eyebrow">6. 五项评分卡</p>
            <div className="mt-4">
              <ScoreCard scoreCard={report.scoreCard} />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div>
              <p className="eyebrow">7. 初步结论</p>
              <div className="mt-4 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-sky-100">
                  {report.recommendation.outcome}
                </span>
                <p className="mt-5 text-sm leading-7 text-slate-200 sm:text-base">
                  {report.recommendation.rationale}
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow">8. 下一步建议</p>
              <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6">
                <div className="space-y-4">
                  {report.recommendation.nextSteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow">Lead Conversion</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  想进一步判断这款产品值不值得投入预算，就不要停在免费初判
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  免费初判只能帮你筛方向，真正决定要不要投入，还要补齐真实竞品链接、评价门槛、利润结构和渠道进入顺序。完整诊断更适合拿来做立项前判断，而不是做完投入后再补作业。
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-700">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-2">
                    真实竞品拆解
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-2">
                    价格与利润测算
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-2">
                    渠道优先级判断
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onBookConsultation}
                className="print-hidden inline-flex min-w-[200px] items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-900"
              >
                预约完整诊断
              </button>
            </div>
          </section>

          <section>
            <p className="eyebrow">9. 免责声明</p>
            <div className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                {report.recommendation.disclaimer}
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
