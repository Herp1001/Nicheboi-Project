import { useEffect, useRef, useState } from 'react'

import CTASection from './components/CTASection'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import LeadForm from './components/LeadForm'
import ReportPreview from './components/ReportPreview'
import { generateReport } from './lib/reportGenerator'
import type { CompetitorInsightReport, LeadInput } from './types/report'

const STORAGE_KEY = 'nicheboi-opc-mvp-state-v1.1'

const initialLeadInput: LeadInput = {
  companyName: '',
  contactName: '',
  contactHandle: '',
  productName: '',
  productType: '智能硬件',
  targetMarket: '美国',
  targetPlatform: 'Amazon',
  targetPriceBand: '',
  productLink: '',
  currentProblems: [],
  productDescription: '',
}

const requiredFields: Array<
  [field: Exclude<keyof LeadInput, 'currentProblems'>, label: string]
> = [
  ['companyName', '公司名称'],
  ['contactName', '联系人'],
  ['contactHandle', '微信或手机号'],
  ['productName', '产品名称'],
  ['targetPriceBand', '目标价格带'],
]

const sampleLeadInput: LeadInput = {
  companyName: '武汉示例科技有限公司',
  contactName: '李经理',
  contactHandle: 'Nicheboi-Demo',
  productName: '标签机',
  productType: '消费电子',
  targetMarket: '美国',
  targetPlatform: 'Amazon',
  targetPriceBand: '$20-$40',
  productLink: '',
  currentProblems: ['看不清竞品', '不知道怎么定价'],
  productDescription:
    '便携式热敏标签机，面向家庭整理、小型商家和轻办公场景，主打安装简单、打印清晰和配件易补充。',
}

interface PersistedToolState {
  leadInput: LeadInput
  report: CompetitorInsightReport | null
  showContactInfo: boolean
}

function scrollToElement(element: HTMLElement | null) {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function loadPersistedState(): PersistedToolState | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as PersistedToolState
  } catch {
    return null
  }
}

function createSampleLeadInput(): LeadInput {
  return {
    ...sampleLeadInput,
    currentProblems: [...sampleLeadInput.currentProblems],
  }
}

export default function App() {
  const [persistedState] = useState<PersistedToolState | null>(() => loadPersistedState())
  const [leadInput, setLeadInput] = useState<LeadInput>(
    persistedState?.leadInput ?? initialLeadInput,
  )
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<CompetitorInsightReport | null>(
    persistedState?.report ?? null,
  )
  const [showContactInfo, setShowContactInfo] = useState(
    persistedState?.showContactInfo ?? false,
  )

  const formRef = useRef<HTMLDivElement | null>(null)
  const reportRef = useRef<HTMLDivElement | null>(null)
  const contactRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const snapshot: PersistedToolState = {
      leadInput,
      report,
      showContactInfo,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }, [leadInput, report, showContactInfo])

  const handleFieldChange = (
    field: Exclude<keyof LeadInput, 'currentProblems'>,
    value: string,
  ) => {
    setLeadInput((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleToggleProblem = (problem: string) => {
    setLeadInput((current) => ({
      ...current,
      currentProblems: current.currentProblems.includes(problem)
        ? current.currentProblems.filter((item) => item !== problem)
        : [...current.currentProblems, problem],
    }))
  }

  const validateLeadInput = () => {
    return requiredFields
      .filter(([field]) => !leadInput[field].trim())
      .map(([, label]) => `请填写${label}`)
  }

  const handleGenerateReport = () => {
    if (loading) {
      return
    }

    const nextErrors = validateLeadInput()

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      scrollToElement(formRef.current)
      return
    }

    setErrors([])
    setLoading(true)
    setShowContactInfo(false)

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      const nextReport = generateReport(leadInput)
      setReport(nextReport)
      setLoading(false)

      window.requestAnimationFrame(() => {
        scrollToElement(reportRef.current)
      })
    }, 2200)
  }

  const handleViewSampleReport = () => {
    const sampleInput = createSampleLeadInput()

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    setErrors([])
    setLoading(false)
    setShowContactInfo(false)
    setLeadInput(sampleInput)
    setReport(generateReport(sampleInput))

    window.requestAnimationFrame(() => {
      scrollToElement(reportRef.current)
    })
  }

  const handleBookConsultation = () => {
    setShowContactInfo(true)

    window.setTimeout(() => {
      scrollToElement(contactRef.current)
    }, 60)
  }

  return (
    <div className="min-h-screen text-slate-900">
      <Header
        onStart={() => scrollToElement(formRef.current)}
        onViewSample={handleViewSampleReport}
      />
      <Hero
        onStart={() => scrollToElement(formRef.current)}
        onViewSample={handleViewSampleReport}
      />

      <main className="mx-auto mt-8 max-w-7xl space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
        <LeadForm
          value={leadInput}
          loading={loading}
          errors={errors}
          formRef={formRef}
          onFieldChange={handleFieldChange}
          onToggleProblem={handleToggleProblem}
          onSubmit={handleGenerateReport}
          onViewSample={handleViewSampleReport}
        />

        {loading ? (
          <section ref={reportRef} className="section-shell p-8 sm:p-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="eyebrow">Step 2</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                正在生成你的产品出海初判报告...
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                当前版本使用前端本地规则生成报告，后续可无缝替换为 OpenAI API、搜索 API 和数据采集流程。
              </p>

              <div className="mt-8 flex h-14 items-end gap-2">
                <span className="loading-bar h-12 w-3 rounded-full bg-slate-950" />
                <span className="loading-bar h-12 w-3 rounded-full bg-sky-700" />
                <span className="loading-bar h-12 w-3 rounded-full bg-slate-400" />
              </div>
            </div>
          </section>
        ) : null}

        {!loading && report ? (
          <ReportPreview
            report={report}
            reportRef={reportRef}
            onBookConsultation={handleBookConsultation}
          />
        ) : null}

        {!loading && !report ? (
          <section ref={reportRef} className="section-shell p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
              <div>
                <p className="eyebrow">Report Output</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  报告会在这里生成
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  生成后页面会输出市场需求初判、竞品结构表、价格带判断、渠道打法判断、五项评分卡和初步结论，并在底部承接“完整诊断”的转化模块。
                </p>
                <button
                  type="button"
                  onClick={handleViewSampleReport}
                  className="mt-6 inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:text-sky-900"
                >
                  查看示例报告
                </button>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">已预留的后续扩展位</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>OpenAI / Perplexity 驱动的深度判断</li>
                  <li>搜索 API 与竞品链接抓取</li>
                  <li>Supabase / 飞书多维表格线索入库</li>
                  <li>Zapier / Make 自动流转</li>
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {!loading && report ? (
          <CTASection
            showContactInfo={showContactInfo}
            contactRef={contactRef}
            onBookConsultation={handleBookConsultation}
          />
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
