import type {
  CompetitorInsightReport,
  CompetitorStructureRow,
  LeadInput,
  ProductType,
  Recommendation,
  ScoreCard,
  ScoreCardItem,
  ScoreLevel,
  TargetPlatform,
} from '../types/report'

type PriceTier = 'low' | 'mid' | 'high' | 'unknown'

interface PriceBandInfo {
  min: number | null
  max: number | null
  tier: PriceTier
}

const demandLensByProductType: Record<ProductType, string> = {
  智能硬件: '该类产品通常要优先判断功能差异、认证门槛、评价积累速度，以及新品牌是否还能切进成熟需求。',
  消费电子: '该类产品往往要先看价格带是否拥挤、评价门槛是否过高、视觉表达和功能卖点能否快速讲清。',
  小型工业品: '该类产品需要先判断规格是否标准化、需求是否稳定，以及履约与交付能力能否形成信任。',
  工具类: '该类产品要先看使用场景是否足够清晰、是否容易做套装与功能差异，以及售后承诺是否有优势。',
  其他: '该类产品需要优先判断市场教育成本、竞品成熟度，以及渠道是否支持新品牌冷启动验证。',
}

const channelAdviceByPlatform: Record<TargetPlatform, string> = {
  Amazon:
    '建议把 Amazon 当作“竞品和评价门槛都很透明”的验证渠道来看。风险不在于有没有需求，而在于成熟竞品已经把关键词、评价和 Listing 表达占住。下一步应先补齐核心词下的竞品链接、评价数量和主图表达，再决定是否切入。',
  'Mercado Libre':
    '建议优先评估 Mercado Libre 的本地物流、价格竞争和经销协同，而不是只看平台流量。风险在于履约和代理资源不到位时，前期验证速度会明显变慢。下一步应先确认本地交付方案与价格落点。',
  Noon:
    '建议把 Noon 视作“本地化要求高于纸面参数”的渠道。风险在于中东消费习惯、履约稳定性和平台活动节奏不到位时，产品很难只靠规格表完成转化。下一步应优先确认代理协同和本地履约能力。',
  Shopee:
    '建议把 Shopee 当作价格和活动节奏驱动型渠道。风险在于低价竞争会非常直接，如果素材、活动响应和履约跟不上，很容易只能看到出单却看不到利润。下一步应先验证基础款价格带和活动承压能力。',
  Lazada:
    '建议先把 Lazada 当作“基础款与组合款验证渠道”来使用。风险在于站点本地化、活动强度和内容素材不到位时，转化效率会低于预期。下一步应先跑通基础款或组合款的转化逻辑，再决定是否扩大投放。',
  'TikTok Shop':
    '建议只有在内容能力、达人合作或短视频素材有准备时再把 TikTok Shop 当主渠道。风险不在产品本身，而在没有内容链路时很难稳定放大。下一步应先验证素材脚本、达人样品机制和转化链路。',
  独立站:
    '建议不要把独立站当成冷启动的唯一渠道。风险在于流量和品牌基础不足时，预算会先消耗在获客前端而不是成交验证上。下一步更适合先用有现成流量的渠道验证，再回到独立站承接品牌与复购。',
}

const levelWeight: Record<ScoreLevel, number> = {
  高: 3,
  中: 2,
  低: 1,
}

const reverseCompetitionWeight: Record<ScoreLevel, number> = {
  高: 1,
  中: 2,
  低: 3,
}

const fixedNextSteps = [
  '补齐目标平台前10个真实竞品链接、主图和价格带',
  '拆出竞品的评价门槛、利润结构和进入成本',
  '进入7天完整诊断，确认先打哪个市场、用什么渠道、怎么切入',
]

const disclaimer =
  '本报告为基于公开商业逻辑与AI辅助模板生成的初步判断，不构成经营承诺，也不替代完整市场调研。其用途是帮助企业判断是否值得进入下一步深度诊断。'

function parsePriceBand(rawPriceBand: string): PriceBandInfo {
  const values = rawPriceBand.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []

  if (values.length === 0) {
    return { min: null, max: null, tier: 'unknown' }
  }

  const min = values[0]
  const max = values[1] ?? values[0]
  const average = (min + max) / 2

  if (average < 25) {
    return { min, max, tier: 'low' }
  }

  if (average <= 80) {
    return { min, max, tier: 'mid' }
  }

  return { min, max, tier: 'high' }
}

function formatRange(min: number, max: number) {
  const safeMin = Math.max(1, Math.round(min))
  const safeMax = Math.max(safeMin + 1, Math.round(max))
  return `$${safeMin}-$${safeMax}`
}

function createRelativeRange(
  info: PriceBandInfo,
  lowMultiplier: number,
  highMultiplier: number,
  fallback: [number, number],
) {
  if (info.min !== null && info.max !== null) {
    return formatRange(info.min * lowMultiplier, info.max * highMultiplier)
  }

  return formatRange(fallback[0], fallback[1])
}

function getFallbackRanges(tier: PriceTier): [number, number][] {
  if (tier === 'low') {
    return [
      [9, 19],
      [18, 29],
      [28, 42],
      [22, 35],
      [19, 31],
    ]
  }

  if (tier === 'high') {
    return [
      [49, 89],
      [79, 129],
      [119, 189],
      [89, 149],
      [75, 138],
    ]
  }

  return [
    [15, 28],
    [28, 45],
    [42, 68],
    [35, 58],
    [30, 52],
  ]
}

function getSellingAngles(productType: ProductType) {
  switch (productType) {
    case '智能硬件':
      return {
        basic: '基础功能可用、连接稳定、安装门槛低',
        feature: '功能点更完整、兼容性更强、上手体验更顺',
        mature: '评价积累稳定、认证更齐、售后响应更成熟',
        bundle: '主机搭配配件或耗材，提升客单和场景完整度',
        vertical: '围绕办公、安防、仓储等细分场景讲方案',
      }
    case '消费电子':
      return {
        basic: '性价比清晰、基础体验稳定、外观表达直接',
        feature: '通过续航、连接、便携性或功能点拉开差异',
        mature: '依赖评价沉淀、品牌信任和高完成度包装表达',
        bundle: '通过配件、礼盒或套装提升整体成交吸引力',
        vertical: '围绕学习、车载、旅行、居家等场景定位',
      }
    case '小型工业品':
      return {
        basic: '规格清晰、可直接替换、交付稳定',
        feature: '耐用性、精度、材质或适配范围更明确',
        mature: '依赖长期评价、稳定供货和标准化信息表达',
        bundle: '通过附件、备件或多规格组合提升采购效率',
        vertical: '围绕工厂、仓储、维修或工程场景解释价值',
      }
    case '工具类':
      return {
        basic: '上手直接、功能够用、价格门槛低',
        feature: '功能更全、使用感更顺、材料或工艺更优',
        mature: '依赖口碑、耐用性反馈和成熟售后承诺',
        bundle: '通过配件、耗材或收纳组合提高成交率',
        vertical: '围绕维修、DIY、户外或专业工种讲方案',
      }
    default:
      return {
        basic: '基础功能完整、信息表达简单直接',
        feature: '通过功能点或场景描述建立差异',
        mature: '依赖评价沉淀、包装表达与履约稳定性',
        bundle: '通过套装或组合提升决策理由',
        vertical: '围绕具体使用场景而不是抽象参数表达价值',
      }
  }
}

function buildCompetitorStructure(
  productType: ProductType,
  priceBandInfo: PriceBandInfo,
): CompetitorStructureRow[] {
  const fallbacks = getFallbackRanges(priceBandInfo.tier)
  const angles = getSellingAngles(productType)

  return [
    {
      competitorType: '低价基础款',
      possiblePriceRange: createRelativeRange(priceBandInfo, 0.65, 0.82, fallbacks[0]),
      typicalSellingPoints: `主打 ${angles.basic}，用低门槛价格快速承接搜索或促销流量。`,
      userFocus: '能不能直接用、价格是否足够低、交付是否稳定。',
      implicationForNewBrand: '如果没有明显成本优势，不建议把纯低价当作唯一切入口。',
    },
    {
      competitorType: '中端功能款',
      possiblePriceRange: createRelativeRange(priceBandInfo, 0.95, 1.12, fallbacks[1]),
      typicalSellingPoints: `强调 ${angles.feature}，适合做“功能更值”的价值表达。`,
      userFocus: '功能是否真的更好、体验是否更顺、是否值得多付一点。',
      implicationForNewBrand: '这是更适合测试差异化的主战场，但卖点必须足够具体。',
    },
    {
      competitorType: '高评价成熟款',
      possiblePriceRange: createRelativeRange(priceBandInfo, 1.18, 1.48, fallbacks[2]),
      typicalSellingPoints: `依赖 ${angles.mature}，通常凭借评价和信任完成转化。`,
      userFocus: '评价数量、稳定性、品牌信任与售后保障。',
      implicationForNewBrand: '不要正面跟成熟款比品牌信任，先找它暂时覆盖不到的切口。',
    },
    {
      competitorType: '套装组合款',
      possiblePriceRange: createRelativeRange(priceBandInfo, 1.02, 1.28, fallbacks[3]),
      typicalSellingPoints: `${angles.bundle}，通过组合方案提高客单并弱化单件比价。`,
      userFocus: '是否省事、是否更划算、是否一次配齐。',
      implicationForNewBrand: '如果主品本身不够突出，套装是相对现实的差异化路径。',
    },
    {
      competitorType: '垂直场景款',
      possiblePriceRange: createRelativeRange(priceBandInfo, 0.92, 1.2, fallbacks[4]),
      typicalSellingPoints: `${angles.vertical}，更强调“适合谁”而不是“参数多强”。`,
      userFocus: '是否对自己的使用场景更贴合、信息是否讲得够明白。',
      implicationForNewBrand: '场景化表达更容易切开泛流量竞争，适合首批验证。',
    },
  ]
}

function buildProblemFocusNote(input: LeadInput) {
  const focusMap: Partial<Record<LeadInput['currentProblems'][number], string>> = {
    不知道先做哪个市场: '当前最需要补的是市场优先级，而不是先把多个市场同时铺开。',
    看不清竞品: '当前最需要补的是竞品地图，而不是直接进入投放或代运营。',
    不知道怎么定价: '当前最需要补的是价格带和利润结构测算，避免一开始就把价格定死。',
    不知道该做平台还是渠道:
      '当前最需要补的是渠道验证顺序，先把第一站打清楚比同时铺多个入口更重要。',
    担心代运营不靠谱:
      '当前更需要先建立自己的判断框架，避免在依据不足时把决策外包出去。',
    已经在做但增长卡住:
      '当前要先确认问题卡在流量、转化、产品带宽还是渠道策略，而不是继续加预算。',
  }

  return input.currentProblems
    .map((problem) => focusMap[problem])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
}

function buildMarketDemandAssessment(input: LeadInput) {
  if (input.targetPlatform === '独立站') {
    return `判断：${input.productName} 不适合把独立站作为冷启动的第一验证入口，更适合作为已有流量、品牌资产或渠道资源的承接页。建议先在更有现成流量的渠道确认需求和成交逻辑，再决定是否回到独立站放大。主要风险在于前期预算会先花在引流而不是验证成交。${demandLensByProductType[input.productType]}`
  }

  return `判断：${input.productName} 在${input.targetMarket}的${input.targetPlatform}有继续验证的理由，但还不到可以直接加预算的阶段。建议先确认三件事：该价格带是不是已经被成熟竞品锁住、新品牌有没有清晰切入口、评价与履约门槛是否在可承受范围内。主要风险不在“有没有需求”，而在于进入时点和切入方式判断失误。${demandLensByProductType[input.productType]}`
}

function buildPriceAssessment(
  input: LeadInput,
  priceBandInfo: PriceBandInfo,
) {
  if (priceBandInfo.tier === 'low') {
    return `建议不要把 ${input.targetPriceBand} 直接当成长期主价格带。这个区间更容易卷入同质化比价，风险在于有出单但利润不够、评价也难积累。下一步应先核对低价竞品的配置、评价门槛和成本结构，确认自己是不是有足够的成本或组合优势。`
  }

  if (priceBandInfo.tier === 'high') {
    return `建议先把 ${input.targetPriceBand} 当作“待证明的高价位”，而不是默认可成交价格。风险在于高价带不能只靠参数堆叠支撑，通常还需要品牌信任、核心功能、评价沉淀和认证背书。下一步应先验证用户为什么愿意多付这部分价差。`
  }

  return `建议把 ${input.targetPriceBand} 作为当前的优先测试带。这个区间通常既有成交空间，也更适合用功能点、套装组合、使用场景或售后承诺做差异化。风险在于如果表达不够具体，最后仍会被用户拉回最低价比较。下一步应先把“为什么值得这个价”讲清楚。`
}

function buildLevel(level: ScoreLevel, explanation: string): Pick<ScoreCardItem, 'level' | 'explanation'> {
  return { level, explanation }
}

function assessMarketDemand(
  input: LeadInput,
  priceBandInfo: PriceBandInfo,
) {
  if (
    input.targetPlatform === 'Amazon' &&
    (input.productType === '智能硬件' || input.productType === '消费电子')
  ) {
    return buildLevel(
      '高',
      `${input.targetPlatform} 对 ${input.productType} 存在成熟搜索需求，但成熟需求也意味着验证门槛已经被市场教育得比较清楚。`,
    )
  }

  if (
    (input.targetPlatform === 'Shopee' || input.targetPlatform === 'Lazada') &&
    priceBandInfo.tier === 'low'
  ) {
    return buildLevel(
      '高',
      `低价带在 ${input.targetPlatform} 更容易获得初步需求验证，但后续能否做出利润会比能否出单更关键。`,
    )
  }

  if (input.targetPlatform === '独立站') {
    return buildLevel(
      priceBandInfo.tier === 'high' ? '中' : '低',
      '独立站更依赖品牌认知与外部流量，需求并不会自然流入，因此冷启动需求获取难度更高。',
    )
  }

  return buildLevel(
    '中',
    `${input.targetPlatform} 上存在一定验证空间，但仍需要用真实竞品、评价门槛和履约条件确认需求是否足够稳。`,
  )
}

function assessPriceSpace(input: LeadInput, priceBandInfo: PriceBandInfo) {
  if (priceBandInfo.tier === 'low') {
    return buildLevel(
      '低',
      `当前价格带更容易陷入同质化对比，${input.productName} 如果没有成本或组合优势，利润承压风险较高。`,
    )
  }

  if (priceBandInfo.tier === 'high') {
    return buildLevel(
      input.targetPlatform === '独立站' ? '中' : '中',
      '高价带并非不能做，但需要更强的品牌、功能、评价或认证支撑，不能只靠“看起来更高级”来卖。',
    )
  }

  return buildLevel(
    '中',
    '中段价格更适合测试差异化，关键不是绝对便宜，而是能否让用户理解为什么值得这个价位。',
  )
}

function assessCompetitionIntensity(
  input: LeadInput,
  priceBandInfo: PriceBandInfo,
) {
  if (
    input.targetPlatform === 'Amazon' &&
    (input.productType === '智能硬件' || input.productType === '消费电子')
  ) {
    return buildLevel(
      '高',
      '成熟类目通常已经有大量评价型竞品，新品牌会同时面对关键词竞争、评价门槛和素材门槛。',
    )
  }

  if (
    (input.targetPlatform === 'Shopee' || input.targetPlatform === 'Lazada') &&
    priceBandInfo.tier === 'low'
  ) {
    return buildLevel(
      '高',
      '低价位类目往往竞争最直观，活动价格、素材产能和履约效率都会迅速拉开差距。',
    )
  }

  return buildLevel(
    '中',
    '当前组合的竞争压力不算轻，但仍有机会通过场景表达、组合策略或渠道执行细节做区隔。',
  )
}

function assessChannelFit(input: LeadInput, priceBandInfo: PriceBandInfo) {
  if (
    input.targetPlatform === 'Mercado Libre' &&
    (priceBandInfo.tier === 'low' || priceBandInfo.tier === 'mid')
  ) {
    return buildLevel(
      '高',
      '如果能配合本地物流与代理协同，中低价格带在 Mercado Libre 的验证效率通常会比高客单更现实。',
    )
  }

  if (input.targetPlatform === '独立站') {
    return buildLevel(
      priceBandInfo.tier === 'high' ? '中' : '低',
      '独立站更适合承接既有流量和品牌资产，作为纯冷启动渠道的匹配度偏弱。',
    )
  }

  if (
    input.targetPlatform === 'Shopee' ||
    input.targetPlatform === 'Lazada' ||
    input.targetPlatform === 'TikTok Shop'
  ) {
    return buildLevel(
      '中',
      '该渠道可以做验证，但能否做起来高度依赖本地化内容、活动节奏或素材供给能力。',
    )
  }

  return buildLevel(
    '中',
    '渠道本身有验证价值，但仍需要结合履约、评价门槛和资源投入方式来确认匹配度。',
  )
}

function assessNewBrandOpportunity(
  input: LeadInput,
  priceBandInfo: PriceBandInfo,
) {
  if (
    input.targetPlatform === 'Mercado Libre' &&
    priceBandInfo.tier !== 'high'
  ) {
    return buildLevel(
      '中',
      '若能解决本地履约和价格表达问题，新品牌仍有空间从分销协同或场景切口切入。',
    )
  }

  if (
    input.targetPlatform === 'TikTok Shop' &&
    (input.productType === '消费电子' || input.productType === '工具类')
  ) {
    return buildLevel(
      '中',
      '新品牌机会更多来自内容表达与场景转化，而不是传统评价壁垒，但执行要求会更高。',
    )
  }

  if (
    input.targetPlatform === 'Noon' &&
    input.productType === '智能硬件'
  ) {
    return buildLevel(
      '中',
      '如果能把本地代理、履约和功能价值表达清楚，新品牌仍有一定试水空间。',
    )
  }

  return buildLevel(
    '低',
    '当前组合下，新品牌更容易先撞上成熟竞品和流量成本，机会存在但不属于轻松切入型。',
  )
}

function buildScoreCard(
  input: LeadInput,
  priceBandInfo: PriceBandInfo,
): ScoreCard {
  const items: ScoreCardItem[] = [
    {
      dimension: '市场需求',
      ...assessMarketDemand(input, priceBandInfo),
    },
    {
      dimension: '价格空间',
      ...assessPriceSpace(input, priceBandInfo),
    },
    {
      dimension: '竞争强度',
      ...assessCompetitionIntensity(input, priceBandInfo),
    },
    {
      dimension: '渠道匹配度',
      ...assessChannelFit(input, priceBandInfo),
    },
    {
      dimension: '新品牌机会',
      ...assessNewBrandOpportunity(input, priceBandInfo),
    },
  ]

  const total = items.reduce((sum, item) => {
    if (item.dimension === '竞争强度') {
      return sum + reverseCompetitionWeight[item.level]
    }

    return sum + levelWeight[item.level]
  }, 0)

  let summary =
    '综合判断，这个组合可以继续验证，但更适合小范围试错，不适合直接上重投入。'

  if (total <= 8) {
    summary =
      '综合判断，当前风险已经先于机会暴露。建议先回到价格结构、渠道顺序和差异化切口上重做判断，再考虑是否继续投入。'
  } else if (total >= 13) {
    summary =
      '综合判断，这个组合有继续深挖的价值，但前提是尽快用真实竞品、评价门槛和利润模型把关键假设补齐。'
  }

  return { items, summary }
}

function buildRecommendation(
  scoreCard: ScoreCard,
  input: LeadInput,
): Recommendation {
  const total = scoreCard.items.reduce((sum, item) => {
    if (item.dimension === '竞争强度') {
      return sum + reverseCompetitionWeight[item.level]
    }

    return sum + levelWeight[item.level]
  }, 0)

  const highRiskDimensions = scoreCard.items
    .filter((item) =>
      item.dimension === '竞争强度' ? item.level === '高' : item.level === '低',
    )
    .map((item) => item.dimension)

  const strongDimensions = scoreCard.items
    .filter((item) =>
      item.dimension === '竞争强度' ? item.level === '低' : item.level === '高',
    )
    .map((item) => item.dimension)

  const problemFocusNote = buildProblemFocusNote(input)

  if (
    total >= 13 &&
    !highRiskDimensions.includes('竞争强度') &&
    !highRiskDimensions.includes('渠道匹配度')
  ) {
    return {
      outcome: '建议继续深度诊断',
      rationale: `${input.productName} 有继续深挖的理由，尤其在 ${strongDimensions.slice(0, 2).join('和') || '需求与渠道验证'} 上仍看得到机会。但结论不是“可以直接上”，而是建议立即进入深度诊断，把真实竞品、评价门槛和利润模型补齐后，再决定首批预算和渠道顺序。${problemFocusNote}`,
      nextSteps: fixedNextSteps,
      disclaimer,
    }
  }

  if (total >= 9) {
    return {
      outcome: '谨慎进入，需先验证价格与竞品',
      rationale: `当前更适合把 ${input.productName} 当作待验证项目，而不是立刻投入项目。主要不确定性集中在 ${highRiskDimensions.slice(0, 2).join('和') || '竞品结构'}，建议先用真实竞品链接、价格带和评价门槛把关键假设跑通，再决定是否进入代运营、广告投放或铺货阶段。${problemFocusNote}`,
      nextSteps: fixedNextSteps,
      disclaimer,
    }
  }

  return {
    outcome: '暂不建议直接投入',
    rationale: `就当前信息看，${input.productName} 在 ${input.targetPlatform} 这组组合里，风险已经先于机会暴露。真正的问题不是“能不能卖”，而是当前入场依据还不够扎实。若没有更强的产品差异、渠道资源或价格结构支撑，不建议直接把预算推进到代运营、广告或铺货阶段。${problemFocusNote}`,
    nextSteps: fixedNextSteps,
    disclaimer,
  }
}

export function generateReport(input: LeadInput): CompetitorInsightReport {
  const priceBandInfo = parsePriceBand(input.targetPriceBand)
  const scoreCard = buildScoreCard(input, priceBandInfo)

  return {
    title: `《${input.productName}出海竞品初判报告》`,
    generatedAt: new Date().toISOString(),
    engineVersion: 'local-rule-engine-v1',
    inputSnapshot: input,
    basicInput: {
      productName: input.productName,
      targetMarket: input.targetMarket,
      targetPlatform: input.targetPlatform,
      targetPriceBand: input.targetPriceBand,
    },
    marketDemandAssessment: buildMarketDemandAssessment(input),
    competitorStructure: buildCompetitorStructure(input.productType, priceBandInfo),
    priceAssessment: buildPriceAssessment(input, priceBandInfo),
    channelStrategy: channelAdviceByPlatform[input.targetPlatform],
    scoreCard,
    recommendation: buildRecommendation(scoreCard, input),
  }
}
