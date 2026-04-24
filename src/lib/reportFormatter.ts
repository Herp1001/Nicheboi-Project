import type { CompetitorInsightReport } from '../types/report'

function formatGeneratedTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatReportAsPlainText(report: CompetitorInsightReport) {
  const lines: string[] = [
    report.title,
    `生成时间：${formatGeneratedTime(report.generatedAt)}`,
    '',
    '1. 基本输入',
    `产品名称：${report.basicInput.productName}`,
    `目标市场：${report.basicInput.targetMarket}`,
    `目标平台：${report.basicInput.targetPlatform}`,
    `价格带：${report.basicInput.targetPriceBand}`,
    '',
    '2. 市场需求初判',
    report.marketDemandAssessment,
    '',
    '3. 竞品结构初判',
  ]

  report.competitorStructure.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.competitorType}`,
      `可能价格带：${item.possiblePriceRange}`,
      `典型卖点：${item.typicalSellingPoints}`,
      `用户关注点：${item.userFocus}`,
      `对新品牌的启示：${item.implicationForNewBrand}`,
      '',
    )
  })

  lines.push(
    '4. 价格带判断',
    report.priceAssessment,
    '',
    '5. 渠道打法判断',
    report.channelStrategy,
    '',
    '6. 五项评分卡',
  )

  report.scoreCard.items.forEach((item) => {
    lines.push(`${item.dimension}：${item.level}｜${item.explanation}`)
  })

  lines.push(
    '',
    '7. 初步结论',
    `${report.recommendation.outcome}：${report.recommendation.rationale}`,
    '',
    '8. 下一步建议',
  )

  report.recommendation.nextSteps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`)
  })

  lines.push(
    '',
    '9. 免责声明',
    report.recommendation.disclaimer,
  )

  return lines.join('\n')
}
