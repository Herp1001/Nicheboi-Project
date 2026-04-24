export type ProductType =
  | '智能硬件'
  | '消费电子'
  | '小型工业品'
  | '工具类'
  | '其他'

export type TargetPlatform =
  | 'Amazon'
  | 'Mercado Libre'
  | 'Noon'
  | 'Shopee'
  | 'Lazada'
  | 'TikTok Shop'
  | '独立站'

export type ScoreLevel = '高' | '中' | '低'

export type RecommendationOutcome =
  | '建议继续深度诊断'
  | '谨慎进入，需先验证价格与竞品'
  | '暂不建议直接投入'

export interface LeadInput {
  companyName: string
  contactName: string
  contactHandle: string
  productName: string
  productType: ProductType
  targetMarket: string
  targetPlatform: TargetPlatform
  targetPriceBand: string
  productLink: string
  currentProblems: string[]
  productDescription: string
}

export interface BasicInputSummary {
  productName: string
  targetMarket: string
  targetPlatform: TargetPlatform
  targetPriceBand: string
}

export interface CompetitorStructureRow {
  competitorType: string
  possiblePriceRange: string
  typicalSellingPoints: string
  userFocus: string
  implicationForNewBrand: string
}

export interface ScoreCardItem {
  dimension:
    | '市场需求'
    | '价格空间'
    | '竞争强度'
    | '渠道匹配度'
    | '新品牌机会'
  level: ScoreLevel
  explanation: string
}

export interface ScoreCard {
  items: ScoreCardItem[]
  summary: string
}

export interface Recommendation {
  outcome: RecommendationOutcome
  rationale: string
  nextSteps: string[]
  disclaimer: string
}

export interface CompetitorInsightReport {
  title: string
  generatedAt: string
  engineVersion: string
  inputSnapshot: LeadInput
  basicInput: BasicInputSummary
  marketDemandAssessment: string
  competitorStructure: CompetitorStructureRow[]
  priceAssessment: string
  channelStrategy: string
  scoreCard: ScoreCard
  recommendation: Recommendation
}

export const PRODUCT_TYPES: ProductType[] = [
  '智能硬件',
  '消费电子',
  '小型工业品',
  '工具类',
  '其他',
]

export const TARGET_MARKETS = [
  '美国',
  '德国',
  '巴西',
  '中东',
  '东南亚',
  '英国',
  '日本',
  '其他',
]

export const TARGET_PLATFORMS: TargetPlatform[] = [
  'Amazon',
  'Mercado Libre',
  'Noon',
  'Shopee',
  'Lazada',
  'TikTok Shop',
  '独立站',
]

export const CURRENT_PROBLEM_OPTIONS = [
  '不知道先做哪个市场',
  '看不清竞品',
  '不知道怎么定价',
  '不知道该做平台还是渠道',
  '担心代运营不靠谱',
  '已经在做但增长卡住',
]
