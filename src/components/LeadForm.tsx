import type { RefObject } from 'react'

import {
  CURRENT_PROBLEM_OPTIONS,
  PRODUCT_TYPES,
  TARGET_MARKETS,
  TARGET_PLATFORMS,
  type LeadInput,
} from '../types/report'

interface LeadFormProps {
  value: LeadInput
  loading: boolean
  errors: string[]
  formRef: RefObject<HTMLDivElement | null>
  onFieldChange: (
    field: Exclude<keyof LeadInput, 'currentProblems'>,
    value: string,
  ) => void
  onToggleProblem: (problem: string) => void
  onSubmit: () => void
  onViewSample: () => void
}

export default function LeadForm({
  value,
  loading,
  errors,
  formRef,
  onFieldChange,
  onToggleProblem,
  onSubmit,
  onViewSample,
}: LeadFormProps) {
  return (
    <div ref={formRef}>
      <section className="section-shell p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 className="section-title mt-2">输入产品信息</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              填完这些字段后，系统会基于本地规则生成一份《单产品出海竞品初判报告》。第一版不联网、不接数据库，重点先把工具体验和报告结构跑起来。
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
            当前版本仅用于演示与线索收集，后续可直接接 OpenAI API / 搜索 API。
          </div>
        </div>

        {errors.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <p className="font-semibold">请先补充以下信息：</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <form
          className="mt-8 space-y-8"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">公司名称</span>
              <input
                value={value.companyName}
                onChange={(event) => onFieldChange('companyName', event.target.value)}
                className="field-shell mt-2 w-full"
                placeholder="例如：武汉某某科技有限公司"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">联系人</span>
              <input
                value={value.contactName}
                onChange={(event) => onFieldChange('contactName', event.target.value)}
                className="field-shell mt-2 w-full"
                placeholder="例如：王总"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">微信或手机号</span>
              <input
                value={value.contactHandle}
                onChange={(event) => onFieldChange('contactHandle', event.target.value)}
                className="field-shell mt-2 w-full"
                placeholder="用于后续完整诊断联系"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">产品名称</span>
              <input
                value={value.productName}
                onChange={(event) => onFieldChange('productName', event.target.value)}
                className="field-shell mt-2 w-full"
                placeholder="例如：标签机、热敏打印机、智能摄像头"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">产品类型</span>
              <select
                value={value.productType}
                onChange={(event) => onFieldChange('productType', event.target.value)}
                className="field-shell mt-2 w-full appearance-none"
              >
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">目标市场</span>
              <select
                value={value.targetMarket}
                onChange={(event) => onFieldChange('targetMarket', event.target.value)}
                className="field-shell mt-2 w-full appearance-none"
              >
                {TARGET_MARKETS.map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">目标平台</span>
              <select
                value={value.targetPlatform}
                onChange={(event) => onFieldChange('targetPlatform', event.target.value)}
                className="field-shell mt-2 w-full appearance-none"
              >
                {TARGET_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">目标价格带</span>
              <input
                value={value.targetPriceBand}
                onChange={(event) => onFieldChange('targetPriceBand', event.target.value)}
                className="field-shell mt-2 w-full"
                placeholder="例如：$20-$40"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-900">
                产品链接
                <span className="ml-2 text-slate-400">可选</span>
              </span>
              <input
                value={value.productLink}
                onChange={(event) => onFieldChange('productLink', event.target.value)}
                className="field-shell mt-2 w-full"
                placeholder="例如：https://example.com/product"
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">当前问题</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              可多选。它会影响报告里“初步结论”和“下一步建议”的侧重点。
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {CURRENT_PROBLEM_OPTIONS.map((problem) => {
                const selected = value.currentProblems.includes(problem)

                return (
                  <label
                    key={problem}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                      selected
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-slate-950'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleProblem(problem)}
                      className="sr-only"
                    />
                    {problem}
                  </label>
                )
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              产品描述
              <span className="ml-2 text-slate-400">可选</span>
            </span>
            <textarea
              value={value.productDescription}
              onChange={(event) =>
                onFieldChange('productDescription', event.target.value)
              }
              rows={5}
              className="field-shell mt-2 w-full resize-none"
              placeholder="可补充产品亮点、当前出海进度、已有渠道或团队情况。"
            />
          </label>

          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                点击后会触发本地规则引擎，模拟“初步竞品洞察”输出效果。后续接入 API 时，这一层交互可保持不变。
              </p>
              <button
                type="button"
                onClick={onViewSample}
                className="mt-3 inline-flex text-sm font-semibold text-sky-900 transition hover:text-sky-700"
              >
                不想填写，也可以先看示例报告
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? '正在生成你的产品出海初判报告...' : '生成初步竞品洞察'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
